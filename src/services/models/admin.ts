
import { AddressBook } from './addressBook';
import { User } from './user';
/*  Model that contains admin data */
export interface Admin { 
    Id?: string;
    FirstName?: string;
    LastName?: string;
    Email?: string;
    Phone?: string;
    Gender?: string;
    BirthDate?: Date;
    Address?: Array<AddressBook>;
    Status?: boolean;
    PersonalUser?: User;
}