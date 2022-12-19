import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable, of, throwError } from 'rxjs' 
import { catchError, map, tap } from 'rxjs/operators'

import { Job } from '../job'

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json', 'withCredentials' :'true' })
}

@Injectable({
  providedIn: 'root'
})
export class JobService {

  private serverUrl = "http://localhost:3002";
  
  constructor(
    private http: HttpClient
  ) { }

  getAllJobs(): Observable<any> {
    return this.http.get(`${this.serverUrl}/jobs/all`, httpOptions).pipe(
      tap(_ => console.log(`fetched all jobs`)),
      catchError(this.handleError<any>('getAllJobs'))
    )
  }

  getJobPost(id:any): Observable<any> {
    return this.http.get(`${this.serverUrl}/jobs/post/${id}`, httpOptions).pipe(
      tap(_=> console.log(`fetched job id=${id}`)),
      catchError(this.handleError<any>('getAllJobs'))
    )
  }

  getJobsPerPage(start:number, limit?:number, order?:string, how?: string, filter?: string, search?:string): Observable<any> {
    let url = `${this.serverUrl}/jobs/page/${start}?=`
    if(limit) url += `&limit=${limit}`
    if(order) url += `&order=${order}`
    if(how) url +=`&how=${how}`
    if(filter) url += `&${filter}`
    if(search) url += `&search=${search}`
    return this.http.get(url, httpOptions).pipe(
      catchError(this.handleError<any>('getJobsPerPage'))
    )
  }

  getRecommendedJobs(id:any, start:number, limit?:number): Observable<any> {
    let url = `${this.serverUrl}/seeker/recommended/${id}/${start}?=`
    if(limit) url += `&limit=${limit}`
    return this.http.get(url, httpOptions).pipe(
      catchError(this.handleError<any>('getRecommendedJobs'))
    )
  }

  getJobsPerPageEmployer(id:any, start:number, limit?:number, order?:string, how?: string): Observable<any> {
    let url = `${this.serverUrl}/employer/jobs/page/${start}?=`
    if(limit) url += `&limit=${limit}`
    if(order) url += `&order=${order}`
    if(how) url +=`&how=${how}`
    url += `&posted_by_id=${id}`
    return this.http.get(url, {withCredentials:true}).pipe(
      catchError(this.handleError<any>('getJobsPerPageEmployer'))
    )
  }

  createJobPost(job: Job): Observable<any> {
    return this.http.post(`${this.serverUrl}/employer/jobs/new`, job, httpOptions).pipe(
      catchError(this.handleError<any>('createJobPost'))
    )
  }

  editJobPost(id:any, job: Job): Observable<any> {
    return this.http.put(`${this.serverUrl}/employer/jobs/${id}`, job, httpOptions).pipe(
      catchError(this.handleError<any>('editJobPost'))
    )
  }

  deleteJobPost(id:any): Observable<any> {
    return this.http.delete(`${this.serverUrl}/employer/jobs/${id}`, httpOptions).pipe(
      catchError(this.handleError<any>('deleteJobPost'))
    )
  }

  applyForJob(appli: any): Observable<any> {
    return this.http.post(`${this.serverUrl}/jobs/application/${appli.job_id}`, appli, httpOptions).pipe(
      catchError(this.handleError<any>('applyForJob'))
    )
  }

  checkIfApplied(appli: any): Observable<any> {
    return this.http.get(`${this.serverUrl}/jobs/application/${appli.job_id}/${appli.user_id}`,  httpOptions)
  }

  deleteApplication(id: any): Observable<any> {
    return this.http.delete(`${this.serverUrl}/jobs/application/${id}`, httpOptions).pipe(
      catchError(this.handleError<any>('deleteApplication'))
    )
  }

  getApplicationsSeeker(user_id: any, page:any): Observable<any> {
    return this.http.get(`${this.serverUrl}/seeker/${user_id}/applications/${page}`, httpOptions).pipe(
      catchError(this.handleError<any>('getApplicationsSeeker'))
    )
  }

  getApplicationsEmployer(user_id: any, page:any): Observable<any> {
    return this.http.get(`${this.serverUrl}/employer/${user_id}/applications/${page}`, httpOptions).pipe(
      catchError(this.handleError<any>('getApplicationsEmployer'))
    )
  }

  changeApplicationStatus(user_id: any, job_id: any, status: string): Observable<any> {
    const payload = {user_id: user_id, status: status}
    return this.http.put(`${this.serverUrl}/employer/applications/${job_id}`, payload, httpOptions).pipe(
      catchError(this.handleError<any>('changeApplicationStatus'))
    )
  }

  sendApplicationTest(appId: any, testId: any, status: string): Observable<any> {
    const payload = {testId: testId, status: status};
    return this.http.put(`${this.serverUrl}/employer/applications/sendTest/${appId}`, payload, httpOptions).pipe(
      catchError(this.handleError<any>('sendApplicationTest'))
    );
  }

  submitApplicationTestCode(data: any): Observable<any> {
    return this.http.post(`${this.serverUrl}/seeker/applications/submitTest`, data, httpOptions).pipe(
      catchError(this.handleError<any>('submitApplicationTestCode'))
    );
  }

  getApplicationTestResult(appId: any): Observable<any> {
    return this.http.get(`${this.serverUrl}/applications/test/${appId}`, httpOptions).pipe(
      catchError(this.handleError<any>('getApplicationTestResult'))
    )
  }

  getInterview(interviewId: any): Observable<any> {
    return this.http.get(`${this.serverUrl}/interview/${interviewId}`, httpOptions).pipe(
      catchError(this.handleError<any>('getInterview'))
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
