
import { Injectable } from '@angular/core';
import { Event } from '../models/event';
import { EventUtils } from '../utils/eventUtils';
import {map, tap} from 'rxjs/operators';
import{CalendarEvent} from 'angular-calendar'

import { HttpClient, HttpHeaders,HttpParams} from '@angular/common/http';
import { throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EventsService {
  protected basePath = environment.basePath;
  constructor(private eventUtils: EventUtils,  private http: HttpClient) { }

  getAllEvents(){
    return this.http.get<Event[]>(`${this.basePath}/api/Event`).pipe(map( (eventList: Event[])=>{
      return eventList;
    }),
    tap((eventList: Event[]) =>{
      this.eventUtils.setEventList(eventList);
    })
    );
  }

  setEvents(event:CalendarEvent)
  {
    
      this.http.post<CalendarEvent>(`${this.basePath}/api/Event`,event).subscribe(event=>console.log("event",event));

  }
}
