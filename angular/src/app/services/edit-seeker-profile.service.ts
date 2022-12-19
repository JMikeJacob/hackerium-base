import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Seeker } from '../seeker'
import { Observable, of, throwError } from 'rxjs'
import { tap, catchError } from 'rxjs/operators'

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json', 'withCredentials' :'true' })
}

@Injectable({
  providedIn: 'root'
})
export class EditSeekerProfileService {

  seeker: Seeker
  private serverUrl = 'http://localhost:3001'
  constructor(private http: HttpClient) { }

  loadProfile(dst: string, id:any): Observable<any> {
    if(this.seeker) {
      console.log(this.seeker)
      this.seeker.user_id = id
      return of({data: this.seeker})
    }
    else {
      console.log("ohoho")
      return this.http.get<any>(`${this.serverUrl}/seeker/profile/${id}?tags=true`, httpOptions).pipe(
        tap(res => this.seeker = res.data),
        catchError(this.handleError<Seeker>('loadProfile'))
      )
    }
  }

  sendProfile(seeker: Seeker): Observable<any> {
    this.seeker = seeker
    return of(this.seeker)
  }

  delProfile() {
    this.seeker = null
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
