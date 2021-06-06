import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable, Optional } from '@angular/core';
import { Teacher } from '../models/teacher';
import { TeacherUtils } from '../utils/teacherUtils';
import {catchError, map, tap} from 'rxjs/operators';
import { Observable, pipe, throwError } from 'rxjs';
import { Configuration } from '../configuration';
import { BASE_PATH } from '../variables';
import { Course } from '../models/course';
import { CourseUtils } from '../utils/courseUtils';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  protected basePath = 'https://localhost:5001';
    public defaultHeaders = new HttpHeaders();
    public configuration = new Configuration();

    constructor(protected http: HttpClient, @Optional()@Inject(BASE_PATH) basePath: string, @Optional() configuration: Configuration, private courseUtil: CourseUtils) {
        if (basePath) {
            this.basePath = basePath;
        }
        if (configuration) {
            this.configuration = configuration;
            this.basePath = basePath || configuration.basePath || this.basePath;
        }
    }
       /**
     * @param consumes string[] mime-types
     * @return true: consumes contains 'multipart/form-data', false: otherwise
     */
        private canConsumeForm(consumes: string[]): boolean {
          const form = 'multipart/form-data';
          for (const consume of consumes) {
              if (form === consume) {
                  return true;
              }
          }
          return false;
      }

  // protected basePath = 'https://localhost:5001';
  // constructor(private teachersUtil: TeacherUtils,  private http: HttpClient) { }

  getAllCourses(){
    let headers = this.defaultHeaders;

    // to determine the Accept header
    let httpHeaderAccepts: string[] = [
        'text/plain',
        'application/json',
        'text/json'
    ];
    const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
    if (httpHeaderAcceptSelected != undefined) {
        headers = headers.set('Accept', httpHeaderAcceptSelected);
    }

    // to determine the Content-Type header
    const consumes: string[] = [
    ];
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
  let headers = this.defaultHeaders;

        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        const consumes: string[] = [
            'application/json-patch+json',
            'application/json',
            'text/json',
            'application/_*+json'
        ];
        const httpContentTypeSelected: string | undefined = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected != undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
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
