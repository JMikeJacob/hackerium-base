import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs'
import { catchError } from 'rxjs/operators'
import { Company } from '../company'


const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json', 'withCredentials': 'true'})
}

@Injectable({
  providedIn: 'root'
})
 
export class CompanyService {
  
  private serverUrl="http://localhost:3001"

  constructor(private http: HttpClient) { }

  getCompanyProfile(id:any): Observable<any>{
    return this.http.get(`${this.serverUrl}/company/${id}`).pipe(
      catchError(this.handleError<Company>('getCompanyProfile'))
    )
  }

  editCompanyProfile(id:any, company: any): Observable<any> {
    return this.http.put(`${this.serverUrl}/company/${id}`, company, httpOptions).pipe(
      catchError(this.handleError<any>('editCompanyProfile'))
    )
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
