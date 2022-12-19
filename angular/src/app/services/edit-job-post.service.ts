import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Job } from '../job'
import { Observable, of, throwError } from 'rxjs'
import { tap, catchError } from 'rxjs/operators'

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json', 'withCredentials' :'true' })
}

@Injectable({
  providedIn: 'root'
})
export class EditJobPostService {

  job: Job
  private serverUrl = 'http://localhost:3002'
  constructor(private http: HttpClient) { }

  loadJob(dst: string, id:any): Observable<any> {
    if(this.job) {
      console.log(this.job)
      this.job.job_id = id
      return of({data: this.job})
    }
    else {
      console.log("ohoho")
      return this.http.get<Job>(`${this.serverUrl}/jobs/post/${id}`, httpOptions).pipe(
        tap(data => this.job = data),
        catchError(this.handleError<any>('loadData'))
      )
    }
  }

  sendJob(job: Job): Observable<any> {
    this.job = job
    return of(this.job)
  }

  delJob() {
    this.job = null
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
