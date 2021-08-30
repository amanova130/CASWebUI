
/* Model that contains data about course*/
export interface CourseAvg {
    courseName: string;
    avg: number;
}

/* Model that contains data about course*/
export interface Average {
    Id: string;
    Name: string;
    courseAvg: CourseAvg[];
}