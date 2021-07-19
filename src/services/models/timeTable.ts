import { Schedule } from "./event";

/* Model that contains data about timeTable*/

export interface TimeTable { 
    Id?:string
    CalendarName:string,
    GroupSchedule:Schedule[],
    CalendarId?:string,
    status?:boolean
}