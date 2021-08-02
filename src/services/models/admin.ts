
import { AddressBook } from './addressBook';
import { User } from './user';
/*  Model that contains admin data */
export interface Admin { 
    Id?: string;
    First_name?: string;
    Last_name?: string;
    Email?: string;
    Phone?: string;
    Image?: string;
    Gender?: string;
    Birth_date?: Date;
    Address?: AddressBook;
    Status?: boolean;
}