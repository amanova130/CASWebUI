// Manage Courses
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, tap } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Course } from '../models/course';
import { environment } from 'src/environments/environment';
import { ErrorHandlerService } from 'src/app/shared/helperServices/errorHandler.service';


@Injectable({
  providedIn: 'root'
})
export class CourseService {
  protected basePath = environment.basePath;
  private courseList: Course[] = [];
  courseListChanged = new Subject<Course[]>();

  constructor(protected http: HttpClient, private errorHandlerService: ErrorHandlerService) { }

  setCourseList(courseList: Course[]) {
    this.courseList = courseList;
    this.courseListChanged.next(this.courseList.slice());
  }

  //Function to get all courses from web api//  
  getAllCourses() {
    return this.http.get<Course[]>(`${this.basePath}/api/Course/getAllCourse`).pipe(map((courseList: Course[]) => {
      return courseList;
    }),
      tap((courseList: Course[]) => {
        this.setCourseList(courseList);
      }),
      catchError(this.errorHandlerService.errorHandler)
    );
  }

  //function to get total number of courses from web api
  getNumberOfCourses() {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.get<number>(`${this.basePath}/api/Course/getNumberOfCourses`)
      .pipe(
        catchError(this.errorHandlerService.errorHandler)
      )
  }

  //function to get single course from web api by given id
  getCourseById(id: string) {
    if (id === null || id === undefined) {
      throw new Error('Required parameter id was null or undefined when calling getCourse.');
    }
    return this.http.get<Course>(`${this.basePath}/api/Course/getCourseById?id=${encodeURIComponent(String(id))}`).pipe(
      catchError(this.errorHandlerService.errorHandler)
    )
  }

// Get array of course name by faculty name
  getCoursesByFaculty(facultyName: string) {
    if (facultyName === null || facultyName === undefined) {
      throw new Error('Required parameter id was null or undefined when calling getCourse.');
    }
    return this.http.get<Array<string>>(`${this.basePath}/api/Course/GetCoursesByFaculty?facultyName=${encodeURIComponent(String(facultyName))}`).pipe(
      catchError(this.errorHandlerService.errorHandler)
    )
  }

  // Get list of Courses by group name
  getCoursesByGroupName(groupName: string) {
    if (groupName === null || groupName === undefined) {
      throw new Error('Required parameter id was null or undefined when calling getCourse.');
    }
    return this.http.get<Course[]>(`${this.basePath}/api/Course/getCourseByGroupName?groupName=${encodeURIComponent(String(groupName))}`).pipe(
      catchError(this.errorHandlerService.errorHandler)
    )
  }
  //function to delete single course with given id
  deleteById(id: string) {
    if (id === null || id === undefined) {
      throw new Error('Required parameter id was null or undefined when calling apiCourseIdDelete.');
    }
    return this.http.delete<Course>(`${this.basePath}/api/Course/deleteCourseById?id=${encodeURIComponent(String(id))}`)
      .pipe(
        catchError(this.errorHandlerService.errorHandler)
      )
  }

  //function to add new course to web api
  create(params: any) {
    return this.http.post<Course>(`${this.basePath}/api/Course/createNewCourse`, params)
      .pipe(
        catchError(this.errorHandlerService.errorHandler)
      )
  }

  //update existing course in web api
  update(params: Course) {
    if (params.Id === null || params.Id === undefined) {
      throw new Error('Required parameter id was null or undefined when calling apiCourseUpdate.');
    }
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<Course>(`${this.basePath}/api/Course/updateCourse`, params)
      .pipe(
        catchError(this.errorHandlerService.errorHandler)
      )
  }

}
