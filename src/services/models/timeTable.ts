/* Model that contains data about timeTable*/
import { Schedule } from "./event";

export interface TimeTable {
    Id?: string
    CalendarName: string,
    GroupSchedule: Schedule[],
    CalendarId?: string,
    status?: boolean
}