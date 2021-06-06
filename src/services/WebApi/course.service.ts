import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable, Optional } from '@angular/core';
import { Teacher } from '../models/teacher';
import { TeacherUtils } from '../utils/teacherUtils';
import {catchError, map, tap} from 'rxjs/operators';
import { Observable, pipe, throwError } from 'rxjs';

import { Course } from '../models/course';
import { CourseUtils } from '../utils/courseUtils';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  protected basePath = 'https://localhost:5001';
  
    constructor(protected http: HttpClient, private courseUtil: CourseUtils) {  }
   
  getAllCourses(){
  
    return this.http.get<Course[]>(`${this.basePath}/api/Course`).pipe(map( (courseList: Course[])=>{
      return courseList;
    }),
    tap((courseList: Course[]) =>{
      this.courseUtil.setCourseList(courseList);
    })
    );
  }

  getTeacherById(id: string){
    if (id === null || id === undefined) {
      throw new Error('Required parameter id was null or undefined when calling getTeacher.');
  }
  return this.http.get<Teacher>(`${this.basePath}/api/Teacher/${encodeURIComponent(String(id))}`).pipe(
    catchError(this.errorHandler)
  )
 }

  deleteById(id: string){
    if (id === null || id === undefined) {
      throw new Error('Required parameter id was null or undefined when calling apiTeacherIdDelete.');
  }
    return this.http.delete<Teacher>(`${this.basePath}/api/Teacher/${encodeURIComponent(String(id))}`)
    .pipe(
      catchError(this.errorHandler)
    )
  }


  create(params: any){
    if (params.Id === null || params.Id === undefined) {
      throw new Error('Required parameter id was null or undefined when calling apiTeacherCreate.');
  }
    return this.http.post<Teacher>(`${this.basePath}/api/Teacher`, params)
    .pipe(
      catchError(this.errorHandler)
    )
  }

  update(id: string, params: any){
    if (id === null || id === undefined) {
      throw new Error('Required parameter id was null or undefined when calling apiTeacherUpdate.');
  }
 
    return this.http.put<Teacher>(`${this.basePath}/api/Teacher/${encodeURIComponent(String(id))}`, params)
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
