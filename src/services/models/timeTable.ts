import { Schedule } from "./recurringEvent";

export interface TimeTable { 
    Id?:string
    CalendarName:string,
    GroupSchedule:Schedule[],
    CalendarId?:string,
    status?:boolean
}