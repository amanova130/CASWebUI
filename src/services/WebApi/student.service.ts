import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Student } from '../models/student';
import { StudentUtils } from '../utils/studentUtils';
import {catchError, map, tap} from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  protected basePath = 'https://localhost:5001';


  constructor(private studentUtils: StudentUtils,  private http: HttpClient) { }

  getAllstudents(){
    return this.http.get<Student[]>(`${this.basePath}/api/Student/getAllStudents`).pipe(map( (studentList: Student[])=>{
      return studentList;
    }),
    tap((studentList: Student[]) =>{
      this.studentUtils.setStudentList(studentList);
    })
    );
  }

  getStudentById(id: string){
    if (id === null || id === undefined) {
      throw new Error('Required parameter id was null or undefined when calling getStudent.');
  }
  return this.http.get<Student>(`${this.basePath}/api/Student/${encodeURIComponent(String(id))}`).pipe(
    catchError(this.errorHandler)
  )
 }

 deleteById(id: string){
  if (id === null || id === undefined) {
    throw new Error('Required parameter id was null or undefined when calling apiStudentIdDelete.');
}
  return this.http.delete<Student>(`${this.basePath}/api/Student/deleteStudentById?id=${encodeURIComponent(String(id))}`)
  .pipe(
    catchError(this.errorHandler)
  )
}

create(params: any){
  if (params.Id === null || params.Id === undefined) {
    throw new Error('Required parameter id was null or undefined when calling apiStudentCreate.');
}
  return this.http.post<Student>(`${this.basePath}/api/Student/createStudent
  `, params)
  .pipe(
    catchError(this.errorHandler)
  )
}


update(studentIn:Student){
  const headers = new HttpHeaders({'Content-Type': 'application/json'});
  return this.http.put<Student>(`${this.basePath}/api/Student/updateStudent`, studentIn)
  .pipe(
    catchError(this.errorHandler)
  )
}

errorHandler(error: { error: { message: string; }; status: any; message: any; }) {
  let errorMessage = '';
  if(error.error instanceof ErrorEvent) {
    errorMessage = error.error.message;
  } else {
    errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
  }
  return throwError(errorMessage);
}
}
