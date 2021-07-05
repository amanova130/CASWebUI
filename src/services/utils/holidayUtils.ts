import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import { Holiday } from '../models/holiday';

@Injectable({
    providedIn: 'root'
})

export class HolidayUtils{

    private holidayList: Holiday[] = [];
    holidayListChanged = new Subject<Holiday[]>();

    constructor(){}

    setHolidayList(holidayList: Holiday[])
    {
        this.holidayList = holidayList;
        this.holidayListChanged.next(this.holidayList.slice());
    }
}