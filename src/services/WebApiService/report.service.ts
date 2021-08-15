import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {catchError, map, tap} from 'rxjs/operators';
import { throwError } from 'rxjs';
import { DatePipe } from '@angular/common';


import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ReportService {
  protected basePath = environment.basePath;;
   
  constructor(protected http: HttpClient,public datepipe: DatePipe) {}

getAverageByCourse(facId:string,courseName:string)
{
  return this.http.get<any>(`${this.basePath}/api/Faculty/getAvgOfFacultiesByCourse?courseName=${encodeURIComponent(String(courseName))}&facId=${encodeURIComponent(String(facId))}`)
    .pipe(
      catchError(this.errorHandler)
    )
}

    errorHandler(error: { error: { message: string; }; status: any; message: any; }) {
        let errorMessage = '';
        if(error.error instanceof ErrorEvent) {
          errorMessage = error.error.message;
        } else {
          errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
        }
        return throwError(errorMessage);
     }
}