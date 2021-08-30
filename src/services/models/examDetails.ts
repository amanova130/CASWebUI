// Exam Details, will handle static string value
import { Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class ExamDetails {
    public Semester: string[] = [
        'A', 'B', 'C'];

    public TestNumber: string[] = [
        'A', 'B'];

    public FieldsForFilter = {
        semester: '',
        year: '',
        group: ''
    }
    public GradeTableHeader: string[] = [
        'Id',
        'First_name',
        'Last_name',
        'Grade',

    ]
}