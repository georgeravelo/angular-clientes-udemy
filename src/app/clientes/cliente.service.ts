import { Injectable } from '@angular/core';
import { formatDate, DatePipe } from '@angular/common';
// import es from '@angular/common/locales/es';

import { Cliente } from './cliente';
import { CLIENTES } from './clientes.json';
import { Observable, of, throwError, from } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, catchError, tap } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Injectable()
export class ClienteService {

  private urlEndPoint: string = 'http://localhost:8080/api/clientes';
  private httpHeaders = new HttpHeaders({'content-type': 'application/json'});

  constructor(private http: HttpClient, private router: Router) { }

  // getClientes(): Observable<Cliente[]> {
  //   // return of(CLIENTES);
  //   return this.http.get<Cliente[]>(this.urlEndPoint);
  // }

  getClientes(page: number): Observable<any> {
    // return of(CLIENTES);
    return this.http.get(this.urlEndPoint + '/page/' + page).pipe(
      map( (response: any) => {
        (response.content as Cliente[]).map(cliente => {
          cliente.nombre = cliente.nombre.toUpperCase();

          // const datePipe = new DatePipe('es-ES');
          // cliente.createAt = datePipe.transform(cliente.createAt, 'EEEE dd, MMMM yyyy');

          // cliente.createAt = formatDate(cliente.createAt, 'fullDate', 'es-ES');
          // cliente.createAt = formatDate(cliente.createAt, 'dd-MM-yyyy', 'en-US');
          return cliente;
        });
        return response;
      } )
    );
  }

  create(cliente: Cliente): Observable<Cliente> {
    return this.http.post(this.urlEndPoint, cliente, {headers: this.httpHeaders}).pipe(
      map(
        (response: any) => response.cliente as Cliente
      ),
      catchError( e => {
        if (e.status === 400) {
          return throwError(e);
        }
        Swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    );
  }

  getCliente(id): Observable<Cliente>{
    return this.http.get<Cliente>(`${this.urlEndPoint}/${id}`).pipe(
      catchError( e => {
        this.router.navigate(['/clientes']);
        Swal.fire('Error al obtener el cliente. ', e.error.mensaje, 'error');
        return throwError(e);
      })
    );
  }

  update(cliente: Cliente): Observable<any> {
    return this.http.put<any>(`${this.urlEndPoint}/${cliente.id}`, cliente, {headers: this.httpHeaders}).pipe(
      catchError( e => {
        if (e.status === 400) {
          return throwError(e);
        }
        Swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    );
  }

  delete(id: number): Observable<Cliente> {
    return this.http.delete<Cliente>(`${this.urlEndPoint}/${id}`, {headers: this.httpHeaders}).pipe(
      catchError( e => {
        Swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    );
  }
}
