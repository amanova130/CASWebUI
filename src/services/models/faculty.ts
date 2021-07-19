
/* Model that contains data about Faculty*/

export interface Faculty { 
    Id?: string;
    FacultyName?: string;
    Description?: string;
    Courses?: Array<string>;
    Status?: boolean;
}