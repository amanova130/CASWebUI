import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {catchError, map, tap} from 'rxjs/operators';
import { throwError } from 'rxjs';
import { TimeTable } from '../models/timeTable';

@Injectable({
  providedIn: 'root'
})
export class TimeTableService {
  protected basePath = 'https://localhost:5001';

  constructor(private http: HttpClient) { }



  

  getTTByGroupNumber(id: string){
    if (id === null || id === undefined) {
      throw new Error('Required parameter id was null or undefined when calling getStudent.');
  }
  return this.http.get<TimeTable>(`${this.basePath}/api/TimeTable/getTTByGroup?id=${encodeURIComponent(String(id))}`).pipe(
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
