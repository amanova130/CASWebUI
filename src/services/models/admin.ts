/*  Model that contains admin data */
import { AddressBook } from './addressBook';

export interface Admin {
    Id?: string;
    First_name?: string;
    Last_name?: string;
    Email?: string;
    Phone?: string;
    Image?: string;
    Gender?: string;
    Birth_date?: string;
    Address?: AddressBook;
    Status?: boolean;
}