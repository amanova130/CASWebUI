import { AddressBook } from './addressBook';
import { StudExam } from './studExam';
import { User } from './user';

export interface Event { 
    startDate?: Date;
    endDate?: Date;
    title?: string;
    color?: Color;
    allDay?: boolean;
   
}
export interface Color{
    primary?:string;
    secondary?:string;
}