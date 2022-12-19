import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable, of, throwError } from 'rxjs' 
import { catchError, map, tap } from 'rxjs/operators'
import { Subject } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  loggedIn: Subject<boolean>

  constructor() { }
}
