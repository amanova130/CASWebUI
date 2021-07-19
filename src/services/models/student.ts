import { AddressBook } from './addressBook';
import { StudExam } from './studExam';
import { User } from './user';

/* Model that contains data about student*/

export interface Student { 
    Id?: string;
    First_name?: string;
    Last_name?: string;
    Email?: string;
    Phone?: string;
    Gender?: string;
    Birth_date?: string;
    Address?: AddressBook;
    Status?: boolean;
    Group_Id?: string;
    Grades?: Array<StudExam>;
}
