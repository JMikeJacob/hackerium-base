import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable, of, from, throwError } from 'rxjs' 
import { catchError, map, tap } from 'rxjs/operators'

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json', 'withCredentials' :'true' })
}
@Injectable({
  providedIn: 'root'
})
export class OptionsService {

  constructor(private http: HttpClient) { }

  options: any
  private serverUrl = 'http://localhost:3001'
  loadData(): Observable<any> {
    
    if(this.options) {
      console.error(this.options.data)
      return of(this.options)
    }
    else {
      console.log("ohoho")
      return this.http.get(`${this.serverUrl}/options`, httpOptions).pipe(
        tap(data => this.options = data),
        catchError(this.handleError<any>('loadData'))
      )
    }
  }

  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      console.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return throwError(error);
    };
  }
}
