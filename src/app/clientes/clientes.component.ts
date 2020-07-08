import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import Swal from 'sweetalert2';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit {

  clientes: Cliente[] = [];
  paginador: any;

  constructor(
    private clienteService: ClienteService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(
      params => {
        let page: number = +params.get('page');
        if (!page) {
          page = 0;
        }
        this.clienteService.getClientes(page).subscribe(
          response => {
            this.clientes = response.content as Cliente[];
            this.paginador = response;
          }
        );
      }
    );
  }

  delete(cliente: Cliente): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.value) {
        this.clienteService.delete(cliente.id).subscribe(
          response => {
            this.clientes = this.clientes.filter(cli => cli !== cliente);
            // this.router.navigate(['/clientes']),
            Swal.fire('Eliminar cliente', `Cliente ${cliente.nombre} eliminado con exito!`, 'success');
          }
        );
      }
    });
  }

}
