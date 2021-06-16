import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable, Optional } from '@angular/core';
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
  
    return this.http.get<Course[]>(`${this.basePath}/api/Course/getAllCourse`).pipe(map( (courseList: Course[])=>{
      return courseList;
    }),
    tap((courseList: Course[]) =>{
      this.courseUtil.setCourseList(courseList);
    })
    );
  }

  getCourseById(id: string){
    if (id === null || id === undefined) {
      throw new Error('Required parameter id was null or undefined when calling getCourse.');
  }
  return this.http.get<Course>(`${this.basePath}/api/Course/getCourseById?id=${encodeURIComponent(String(id))}`).pipe(
    catchError(this.errorHandler)
  )
 }

  deleteById(id: string){
    if (id === null || id === undefined) {
      throw new Error('Required parameter id was null or undefined when calling apiCourseIdDelete.');
  }
    return this.http.delete<Course>(`${this.basePath}/api/Course/deleteCourseById?id=${encodeURIComponent(String(id))}`)
    .pipe(
      catchError(this.errorHandler)
    )
  }


  create(params: any){
    return this.http.post<Course>(`${this.basePath}/api/Course/createCourse`, params)
    .pipe(
      catchError(this.errorHandler)
    )
  }

  update(params: Course){
    if (params.Id === null || params.Id === undefined) {
      throw new Error('Required parameter id was null or undefined when calling apiCourseUpdate.');
  }
  const headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.put<Course>(`${this.basePath}/api/Course/updateCourse`, params)
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
