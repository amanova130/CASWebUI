// Manage all student requests

import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Student } from '../models/student';
import { catchError, map, tap } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ErrorHandlerService } from 'src/app/shared/helperServices/errorHandler.service';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  protected basePath = environment.basePath; //Path to connect with Web API
  private studentList: Student[] = [];
  studentListChanged = new Subject<Student[]>();

  constructor(private http: HttpClient, private errorHandlerService: ErrorHandlerService) { }

  // Set StudentList for deep copy
  setStudentList(studentList: Student[]) {
    this.studentList = studentList;
    this.studentListChanged.next(this.studentList.slice());

  }

  // Get All student list
  getAllstudents() {
    return this.http.get<Student[]>(`${this.basePath}/api/Student/getAllStudents`).pipe(map((studentList: Student[]) => {
      return studentList;
    }),
      tap((studentList: Student[]) => {
        this.setStudentList(studentList);
      }),
      catchError(this.errorHandlerService.errorHandler)
    );
  }

  // Get Students by group name
  getStudentsByGroup(groupNumber: string) {
    return this.http.get<Student[]>(`${this.basePath}/api/Student/getAllStudentsByGroup?groupName=${encodeURIComponent(String(groupNumber))}`).pipe(
      catchError(this.errorHandlerService.errorHandler)
    );
  }

  getStudentsByGroups(groupNumbers: string[]) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let queryParameters = new HttpParams();
    if (groupNumbers) {
      groupNumbers.forEach((element) => {
        queryParameters = queryParameters.append('groupNames', <any>element);
      })
    }
    return this.http.get<Array<Student>>(`${this.basePath}/api/Student/getAllStudentsByGroups`, { params: queryParameters, headers: headers }).pipe(
      catchError(this.errorHandlerService.errorHandler)
    );
  }

  // Get Students by faculties name
  getStudentsByFaculties(facNumbers: string[]) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let queryParameters = new HttpParams();
    if (facNumbers) {
      facNumbers.forEach((element) => {
        queryParameters = queryParameters.append('facultyNames', <any>element);
      })
    }
    return this.http.get<Array<Student>>(`${this.basePath}/api/Student/getAllStudentsByFaculties`, { params: queryParameters, headers: headers }).pipe(
      catchError(this.errorHandlerService.errorHandler)
    );
  }


  // Get Number of Student
  getNumberOfStudents() {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.get<number>(`${this.basePath}/api/Student/getNumberOfStudents`)
      .pipe(
        catchError(this.errorHandlerService.errorHandler)
      )
  }

  // Get number of Student in specific Class
  getNumberOfStudentsInClass(groupNum: string) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.get<number>(`${this.basePath}/api/Student/getNumberOfStudentsInClass?id=${encodeURIComponent(String(groupNum))}`)
      .pipe(
        catchError(this.errorHandlerService.errorHandler)
      )
  }

  // Get student profile by Id
  getStudentById(id: string) {
    if (id === null || id === undefined) {
      throw new Error('Required parameter id was null or undefined when calling getStudent.');
    }
    return this.http.get<Student>(`${this.basePath}/api/Student/getStudentById?id=${encodeURIComponent(String(id))}`).pipe(
      catchError(this.errorHandlerService.errorHandler)
    )
  }

  //  Delete Student By Id
  deleteById(id: string) {
    if (id === null || id === undefined) {
      throw new Error('Required parameter id was null or undefined when calling apiStudentIdDelete.');
    }
    return this.http.delete<Student>(`${this.basePath}/api/Student/deleteStudentById?id=${encodeURIComponent(String(id))}`)
      .pipe(
        catchError(this.errorHandlerService.errorHandler)
      )
  }

  // Create a new Student profile
  create(params: any) {
    if (params.Id === null || params.Id === undefined) {
      throw new Error('Required parameter id was null or undefined when calling apiStudentCreate.');
    }
    return this.http.post<Student>(`${this.basePath}/api/Student/createStudent
  `, params)
      .pipe(
        catchError(this.errorHandlerService.errorHandler)
      )
  }

  // Create a new Student profile
  insertListOfStudents(params: any) {
    if (params === null || params === undefined) {
      throw new Error('Required parameter id was null or undefined when calling apiStudentCreate.');
    }
    return this.http.post<Student>(`${this.basePath}/api/Student/insertListOfStudents
  `, params)
      .pipe(
        catchError(this.errorHandlerService.errorHandler)
      )
  }

  // Update an existed student profile
  update(studentIn: Student) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<Student>(`${this.basePath}/api/Student/updateStudent`, studentIn)
      .pipe(
        catchError(this.errorHandlerService.errorHandler)
      )
  }

}


