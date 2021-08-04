import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Student } from '../models/student';
import { StudentUtils } from '../utils/studentUtils';
import {catchError, map, tap} from 'rxjs/operators';
import { throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  protected basePath = environment.basePath; //Path to connect with Web API


  constructor(private studentUtils: StudentUtils,  private http: HttpClient) { }

  // Get All student list
  getAllstudents(){
    return this.http.get<Student[]>(`${this.basePath}/api/Student/getAllStudents`).pipe(map( (studentList: Student[])=>{
      return studentList;
    }),
    tap((studentList: Student[]) =>{
      this.studentUtils.setStudentList(studentList);
    })
    );
  }

  getStudentsByGroup(groupNumber:string){
    return this.http.get<Student[]>(`${this.basePath}/api/Student/getAllStudentsByGroup?groupName=${encodeURIComponent(String(groupNumber))}`).pipe(
      catchError(this.errorHandler)
    )
  }

  getStudentsByGroups(groupNumbers:string[]){
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    let queryParameters = new HttpParams();
        if (groupNumbers) {
          groupNumbers.forEach((element) => {
                queryParameters = queryParameters.append('groupNames', <any>element);
            })
        }
    return this.http.get<Array<Student>>(`${this.basePath}/api/Student/getAllStudentsByGroups`,{params: queryParameters,headers:headers});
            
}

getStudentsByFaculties(facNumbers:string[]){
  const headers = new HttpHeaders({'Content-Type': 'application/json'});
  let queryParameters = new HttpParams();
      if (facNumbers) {
        facNumbers.forEach((element) => {
              queryParameters = queryParameters.append('facultyNames', <any>element);
          })
      }
  return this.http.get<Array<Student>>(`${this.basePath}/api/Student/getAllStudentsByFaculties`,{params: queryParameters,headers:headers});
    }
  // Get Number of Student
  getNumberOfStudents()
  {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.get<number>(`${this.basePath}/api/Student/getNumberOfStudents`)
    .pipe(
      catchError(this.errorHandler)
    )
  }

  // Get number of Student in specific Class
  getNumberOfStudentsInClass(groupNum:string)
  {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.get<number>(`${this.basePath}/api/Student/getNumberOfStudentsInClass?id=${encodeURIComponent(String(groupNum))}`)
    .pipe(
      catchError(this.errorHandler)
    )
  }

  // Get student profile by Id
  getStudentById(id: string){
    if (id === null || id === undefined) {
      throw new Error('Required parameter id was null or undefined when calling getStudent.');
  }
  return this.http.get<Student>(`${this.basePath}/api/Student/getStudentById?id=${encodeURIComponent(String(id))}`).pipe(
    catchError(this.errorHandler)
  )
 }

//  Delete Student By Id
 deleteById(id: string){
  if (id === null || id === undefined) {
    throw new Error('Required parameter id was null or undefined when calling apiStudentIdDelete.');
}
  return this.http.delete<Student>(`${this.basePath}/api/Student/deleteStudentById?id=${encodeURIComponent(String(id))}`)
  .pipe(
    catchError(this.errorHandler)
  )
}

// Create a new Student profile
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

// Create a new Student profile
insertListOfStudents(params: any){
  if (params === null || params === undefined) {
    throw new Error('Required parameter id was null or undefined when calling apiStudentCreate.');
}
  return this.http.post<Student>(`${this.basePath}/api/Student/insertListOfStudents
  `, params)
  .pipe(
    catchError(this.errorHandler)
  )
}

// Update an existed student profile
update(studentIn:Student){
  const headers = new HttpHeaders({'Content-Type': 'application/json'});
  return this.http.put<Student>(`${this.basePath}/api/Student/updateStudent`, studentIn)
  .pipe(
    catchError(this.errorHandler)
  )
}

// Error handler for HTTP response
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


