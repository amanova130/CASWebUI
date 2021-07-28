import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { catchError, map, tap } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { TimeTable } from '../models/timeTable';
import { Schedule } from '../models/event';
import { group } from '@angular/animations';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {
  

  protected basePath = environment.basePath;

  constructor(private http: HttpClient) { }

  // Add a new Event for Group
  addEventToSchedule(event: Schedule, groupId: string) {
    const param={
      
      Start:event.Start,
      End:event.End,
      Title:event.Title,
      Color:event.Color.primary,
      GroupName:groupId,
      LastDate:event.LastDate,
      Teacher:event.Teacher
    }
    
    if (event === null || event === undefined || groupId === null || groupId === undefined) {
      throw new Error('Required parameter id was null or undefined when calling apiScheduleCreate.');
    }
    return this.http.post<Schedule>(`${this.basePath}/api/Schedule/createEvent?groupId=${encodeURIComponent(String(groupId))}`, param)
      .pipe(
        catchError(this.errorHandler)
      )

  }

editEvent(event:Schedule,groupId:string)
{
  const param={
      
    Start:event.Start,
    End:event.End,
    Title:event.Title,
    Color:event.Color.primary,
    GroupName:groupId,
    LastDate:event.LastDate,
    Teacher:event.Teacher,
    EventId:event.EventId
  }
  
  if (event === null || event === undefined || groupId === null || groupId === undefined) {
    throw new Error('Required parameter id was null or undefined when calling apiScheduleCreate.');
  }
  return this.http.put<Schedule>(`${this.basePath}/api/Schedule/updateEvent?groupId=${encodeURIComponent(String(groupId))}`, param)
    .pipe(
      catchError(this.errorHandler)
    )
}

  // Delete Event by id and Group id
  deleteEvent(eventId: string, groupId: string) {
    if (eventId === null || eventId === undefined || groupId === null || groupId === undefined) {
      throw new Error('Required parameter id was null or undefined when calling apiEventIdDelete.');
    }
    return this.http.delete<Schedule>(`${this.basePath}/api/Schedule/deleteEvent?eventId=${encodeURIComponent(String(eventId))}&groupId=${encodeURIComponent(String(groupId))}`)
      .pipe(
        catchError(this.errorHandler)
      )
  }

  // Error Handler for HTTP response
  errorHandler(error: { error: { message: string; }; status: any; message: any; }) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(errorMessage);
  }
}