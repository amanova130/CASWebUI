

/* Model that contains data about group*/
export interface Group { 
    Id?: string;
    GroupNumber?: string;
    NumberOfStudent?: number;
    AcademicYear?: number;
    Semester?: number;
    courses?: Array<string>;
    Fac_Name?: string;
    Status?: boolean;
}