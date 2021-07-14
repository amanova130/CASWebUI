import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import {catchError, map, tap} from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { TimeTable } from '../models/timeTable';
import { Schedule } from '../models/recurringEvent';
import { group } from '@angular/animations';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {
  protected basePath = 'https://localhost:5001';

  constructor( private http: HttpClient) { }



  

  addEventToSchedule(event:Schedule,groupId:string){
    
    const param={
      
      start:event.start,
      end:event.end,
      title:event.title,
      color:event.color.primary,
      groupName:groupId,
      lastDate:event.lastDate,
      eventId:event.eventId
    }
    if (event === null || event === undefined || groupId === null || groupId === undefined) {
        throw new Error('Required parameter id was null or undefined when calling apiScheduleCreate.');
    }
    return this.http.post<Schedule>(`${this.basePath}/api/Schedule/createEvent?groupId=${encodeURIComponent(String(groupId))}`, param)
      .pipe(
        catchError(this.errorHandler)
      )

}


deleteEvent(eventId: string,groupId:string){
  if (eventId === null || eventId === undefined || groupId === null || groupId === undefined) {
    throw new Error('Required parameter id was null or undefined when calling apiEventIdDelete.');
}
  return this.http.delete<Schedule>(`${this.basePath}/api/Schedule/deleteEvent?eventId=${encodeURIComponent(String(eventId))}&groupId=${encodeURIComponent(String(groupId))}`)
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