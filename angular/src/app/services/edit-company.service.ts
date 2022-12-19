import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Company } from '../company'
import { Observable, of, throwError } from 'rxjs'
import { tap, catchError } from 'rxjs/operators'

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json', 'withCredentials' :'true' })
}

@Injectable({
  providedIn: 'root'
})
export class EditCompanyService {

  company: Company
  private serverUrl = 'http://localhost:3001'
  constructor(private http: HttpClient) { }

  loadCompany(dst: string, id:any): Observable<any> {
    if(this.company) {
      console.log(this.company)
      this.company.company_id = id
      return of({success: {data: this.company}})
    }
    else {
      console.log("ohoho")
      return this.http.get<any>(`${this.serverUrl}/company/${id}`).pipe(
        tap(res => this.company = res.success.data),
        catchError(this.handleError<Company>('getCompanyProfile'))
      )
    }
  }

  sendCompany(company: Company): Observable<any> {
    this.company = company
    return of(this.company)
  }

  delCompany() {
    this.company = null
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
