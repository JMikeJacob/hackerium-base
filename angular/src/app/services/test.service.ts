import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable, of, throwError } from 'rxjs' 
import { catchError, map, tap } from 'rxjs/operators'

import { Test } from '../test'

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json', 'withCredentials' :'true' })
}

@Injectable({
  providedIn: 'root'
})
export class TestService {

  private serverUrl = "http://localhost:3004"
  
  constructor(
    private http: HttpClient
  ) { }


  createTest(test: any): Observable<any> {
    return this.http.post(`${this.serverUrl}/createTest`, test, httpOptions).pipe(
      catchError(this.handleError<any>('createTest'))
    )
  }

  getAllTestsCompany(companyId: string): Observable<any> {
    return this.http.get(`${this.serverUrl}/company/${companyId}/tests`, httpOptions).pipe(
      tap(_ => console.log(`fetched all tests`)),
      catchError(this.handleError<any>('getAllTests'))
    )
  }

  getTestById(id:any): Observable<any> {
    return this.http.get(`${this.serverUrl}/test/${id}`, httpOptions).pipe(
      tap(_=> console.log(`fetched test id=${id}`)),
      catchError(this.handleError<any>('getTestById'))
    )
  }

  runCustomCase(data: any): Observable<any> {
    return this.http.post(`${this.serverUrl}/run`, data, httpOptions).pipe(
      catchError(this.handleError<any>('runCustomCase'))
    );
  }

  runTestCases(data: any): Observable<any> {
    return this.http.post(`${this.serverUrl}/runMultiple`, data, httpOptions).pipe(
      catchError(this.handleError<any>('runTestCases'))
    );
  }

  // getTests(id:any): Observable<any> {
  //   return this.http.get(`${this.serverUrl}/jobs/post/${id}`, httpOptions).pipe(
  //     tap(_=> console.log(`fetched job id=${id}`)),
  //     catchError(this.handleError<any>('getAllJobs'))
  //   )
  // }

  // getJobsPerPage(start:number, limit?:number, order?:string, how?: string, filter?: string, search?:string): Observable<any> {
  //   let url = `${this.serverUrl}/jobs/page/${start}?=`
  //   if(limit) url += `&limit=${limit}`
  //   if(order) url += `&order=${order}`
  //   if(how) url +=`&how=${how}`
  //   if(filter) url += `&${filter}`
  //   if(search) url += `&search=${search}`
  //   return this.http.get(url, httpOptions).pipe(
  //     catchError(this.handleError<any>('getJobsPerPage'))
  //   )
  // }

  getTestsPerPageEmployer(id:any, start:number, limit?:number, order?:string, how?: string): Observable<any> {
    let url = `${this.serverUrl}/employer/tests/page/${start}?=`
    if(limit) url += `&limit=${limit}`
    if(order) url += `&order=${order}`
    if(how) url +=`&how=${how}`
    url += `&posted_by_id=${id}`
    return this.http.get(url, {withCredentials:true}).pipe(
      catchError(this.handleError<any>('getTestsPerPageEmployer'))
    )
  }

  // editJobPost(id:any, job: Job): Observable<any> {
  //   return this.http.put(`${this.serverUrl}/employer/jobs/${id}`, job, httpOptions).pipe(
  //     catchError(this.handleError<any>('editJobPost'))
  //   )
  // }

  // deleteJobPost(id:any): Observable<any> {
  //   return this.http.delete(`${this.serverUrl}/employer/jobs/${id}`, httpOptions).pipe(
  //     catchError(this.handleError<any>('deleteJobPost'))
  //   )
  // }

  editTest(id:any, test: Test): Observable<any> {
    return this.http.put(`${this.serverUrl}/test/${id}`, test, httpOptions).pipe(
      catchError(this.handleError<any>('editTest'))
    )
  }

  deleteTest(id: any): Observable<any> {
    return this.http.delete(`${this.serverUrl}/test/${id}`, httpOptions).pipe(
      catchError(this.handleError<any>('deleteTest'))
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
