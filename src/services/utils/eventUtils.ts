import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class EventUtils{

    private  eventList: Event[] = [];
    eventListChanged = new Subject<Event[]>();

    constructor(){}

    setEventList(eventList: Event[])
    {
        this.eventList = eventList;
        this.eventListChanged.next(this.eventList.slice());
        console.log(this.eventListChanged);
    }
}