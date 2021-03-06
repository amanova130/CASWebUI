/* Model that contains data about teacher*/
import { AddressBook } from './addressBook';

export interface Teacher {
    Id: string;
    First_name?: string;
    Last_name?: string;
    Email?: string;
    Phone?: string;
    Gender?: string;
    Image?: string;
    Birth_date?: Date;
    Address?: AddressBook;
    Status?: boolean;
    TeachesCourses?: Array<string>;
}