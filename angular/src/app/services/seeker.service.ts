import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Seeker } from '../seeker'
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})

export class SeekerService {
  private serverUrl="http://localhost:3001"

  constructor(
    private http: HttpClient
  ) { }

  addSeeker(seeker: Seeker): Observable<any> {
    return this.http.post<Seeker>(`${this.serverUrl}/register`, seeker, httpOptions).pipe(
      tap(seeker => {console.log(`added seeker ${seeker.email}`)}),
      catchError(this.handleError<Seeker>('addSeeker'))
    )
  }

  loginSeeker(seeker: Seeker): Observable<any> {
    return this.http.post<any>(`${this.serverUrl}/login`, seeker, httpOptions).pipe(
      tap(seeker => {console.log(`logged in seeker ${seeker.email}`)}),
      catchError(this.handleError<any>('loginSeeker'))
    )
  }

  getSeeker(email: string): Observable<any> {
    return this.http.get<any>(`${this.serverUrl}/seeker/account`, httpOptions).pipe(
      tap(_ => console.log(`fetched seeker ${email}`),
      catchError(this.handleError<any>('getSeeker')))
    )
  }

  getSeekerAccount(id: any): Observable<any> {
    return this.http.get<any>(`${this.serverUrl}/seeker/${id}`, httpOptions).pipe(
      catchError(this.handleError<Seeker>('getSeekerAccount'))
    )
    
  }

  getSeekerProfile(id: any): Observable<any> {
    return this.http.get<any>(`${this.serverUrl}/seeker/profile/${id}?tags=true`, httpOptions).pipe(
      catchError(this.handleError<Seeker>('getSeekerProfile'))
    )
  }

  getSeekerProfileNoTags(id: any): Observable<any> {
    return this.http.get<any>(`${this.serverUrl}/seeker/profile/${id}`, httpOptions).pipe(
      catchError(this.handleError<Seeker>('getSeekerProfileNoTags'))
    )
  }

  editSeekerProfile(id: any, seeker: Seeker): Observable<any> {
    return this.http.put<any>(`${this.serverUrl}/seeker/profile/${id}`, seeker, httpOptions).pipe(
      catchError(this.handleError<Seeker>('editSeekerProfile'))
    )
  }

  editSeekerAccount(seeker: any): Observable<any> {
    return this.http.put<any>(`${this.serverUrl}/account/${seeker.id}`, seeker, httpOptions).pipe(
      catchError(this.handleError<any>('editSeekerAccount'))
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


