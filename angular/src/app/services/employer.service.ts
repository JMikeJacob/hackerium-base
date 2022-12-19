import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable, of, throwError } from 'rxjs'
import { catchError, map, tap } from 'rxjs/operators'
import { Employer } from '../employer'
import { Company } from '../company'

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json', 'withCredentials': 'true'}),
}

@Injectable({
  providedIn: 'root'
})
export class EmployerService {

  private serverUrl = "http://localhost:3001"

  constructor(
    private http: HttpClient
  ) { }

  addEmployer(employer: Employer): Observable<any> {
    return this.http.post<Employer>(`${this.serverUrl}/register?role=employer`, employer, httpOptions).pipe(
      tap(employer => console.log(`added employer ${employer.email}`)),
      catchError(this.handleError<Employer>('addEmployer'))
    )
  } 

  loginEmployer(employer: any): Observable<any> {
    return this.http.post<Employer>(`${this.serverUrl}/login?role=employer`, employer, {withCredentials:true}).pipe(
      tap(employer => console.log(`logged in employer ${employer.email}`)),
      catchError(this.handleError<Employer>('loginEmployer'))
    )
  }

  getEmployerAccount(id: any): Observable<any> {
    return this.http.get<any>(`${this.serverUrl}/employer/${id}`, httpOptions).pipe(
      catchError(this.handleError<Employer>('getEmployerAccount'))
    )
    
  }

  editCompanyProfile(id: any, company: Company): Observable<any> {
    return this.http.put<Company>(`${this.serverUrl}/company/${id}`, company, httpOptions).pipe(
      catchError(this.handleError<Employer>('editCompanyProfile'))
    )
  }

  editEmployerAccount(id: any, employer: any): Observable<any> {
    return this.http.put<any>(`${this.serverUrl}/account/${id}?role=employer`, employer, httpOptions).pipe(
      catchError(this.handleError<any>('editEmployerAccount'))
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
