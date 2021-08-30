/* Model that contains data about student*/
import { AddressBook } from './addressBook';

export interface Student {
    Id?: string;
    First_name?: string;
    Last_name?: string;
    Email?: string;
    Phone?: string;
    Gender?: string;
    Birth_date?: string;
    Address?: AddressBook;
    Image?: string;
    Status?: boolean;
    Group_Id?: string;
}
