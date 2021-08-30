/* Model that contains data about schedule*/
import { Teacher } from "./teacher";


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