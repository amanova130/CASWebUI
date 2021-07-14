import { CalendarEventAction } from "angular-calendar";
import RRule from "rrule";

export interface Schedule {
    start:Date,
    end:Date,
    title: string;
    color: any;
    rrule?: {
      freq: any;
      bymonth?: number;
      bymonthday?: number;
      byweekday?: any;
    };
    lastDate:Date,
    eventId?:string
  }