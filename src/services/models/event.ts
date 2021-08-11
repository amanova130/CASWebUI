import { CalendarEventAction } from "angular-calendar";
import RRule from "rrule";
import { Teacher } from "./teacher";

/* Model that contains data about schedule*/
export interface Schedule {
    Start:Date,
    End:Date,
    Title: string;
    Color: any;
    rrule?: {
      freq?: any;
      bymonth?: number;
      bymonthday?: number;
      byweekday?: any;
    };
    LastDate:Date,
    EventId?:string,
    Teacher?:Teacher
  }