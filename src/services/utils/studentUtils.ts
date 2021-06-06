import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import { Student } from '../models/student';

@Injectable({
    providedIn: 'root'
})

export class StudentUtils{

    private studentList: Student[] = [];
    studentListChanged = new Subject<Student[]>();

    constructor(){}

    setStudentList(studentList: Student[])
    {
        this.studentList = studentList;
        this.studentListChanged.next(this.studentList.slice());
        console.log(this.studentListChanged);
    }
}