import { Injectable } from '@angular/core'
import { Observable, of, throwError } from 'rxjs'
import { catchError } from 'rxjs/operators'
import * as AWS from 'aws-sdk'
import { HttpClient, HttpHeaders } from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})

export class FileService {

  constructor(private http: HttpClient) {}

  bucket = 'michael-hackerium';
  s3 = new AWS.S3();

  uploadToAWSS3(fileurl:string, contenttype:string, file:any): Observable<any>{
    const httpOptions = {headers: new HttpHeaders({'Content-Type': contenttype})}
    console.log(httpOptions)
    return this.http.put(fileurl, file, httpOptions).pipe(
      catchError(this.handleError<any>('uploadToAWSS3'))
    )
  }

  getSignedUrl(data:any): Observable<any>{
    const httpOptions = {headers: new HttpHeaders({'Content-Type': 'application/json'})}
    return this.http.post('http://localhost:3001/aws/url', data, httpOptions).pipe(
      catchError(this.handleError<any>('getSignedUrl'))
    )
  }

  getFileFromAWSS3(key: any): Observable<any> {
    let text = null;

    const params = {
      Bucket: this.bucket,
      Key: key
    };

    return Observable.create((observer) => {
      this.s3.getObject(params, (err, data) => {
        if(err) {
          console.error(err);
          observer.error(err);
        }
        else {
          console.log(data);
          observer.next(data);
          observer.complete();
        }
      })
    })

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
