
import { Injectable } from '@angular/core';
import { Event } from '../models/event';
import { EventUtils } from '../utils/eventUtils';
import {map, tap} from 'rxjs/operators';
import{CalendarEvent} from 'angular-calendar'

import { HttpClient, HttpHeaders,HttpParams} from '@angular/common/http';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventsService {

  constructor(private eventUtils: EventUtils,  private http: HttpClient) { }

  getAllEvents(){
    return this.http.get<Event[]>('https://localhost:5001/api/Event').pipe(map( (eventList: Event[])=>{
      return eventList;
    }),
    tap((eventList: Event[]) =>{
      this.eventUtils.setEventList(eventList);
    })
    );
  }

  setEvents(event:CalendarEvent)
  {
    
      this.http.post<CalendarEvent>('https://localhost:5001/api/Event',event).subscribe(event=>console.log("event",event));

  }
}
