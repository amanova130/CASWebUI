import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Student } from '../models/student';
import { StudentUtils } from '../utils/studentUtils';
import {map, tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class StudentsService {

  constructor(private studentUtils: StudentUtils,  private http: HttpClient) { }

  getAllstudents(){
    return this.http.get<Student[]>('https://localhost:5001/api/Student/getAllStudents').pipe(map( (studentList: Student[])=>{
      return studentList;
    }),
    tap((studentList: Student[]) =>{
      this.studentUtils.setStudentList(studentList);
    })
    );
  }
}
