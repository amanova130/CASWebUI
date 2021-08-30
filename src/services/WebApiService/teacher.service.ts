import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Teacher } from '../models/teacher';
import { catchError, map, tap } from 'rxjs/operators';
import { Subject, throwError } from 'rxjs';
import { DatePipe } from '@angular/common';
import { environment } from 'src/environments/environment';
import { ErrorHandlerService } from '../../app/shared/helperServices/errorHandler.service';



@Injectable({
  providedIn: 'root'
})
export class TeacherService {
  protected basePath = environment.basePath; // Path to connect with Backend
  private teacherList: Teacher[] = [];
  teacherListChanged = new Subject<Teacher[]>();
  constructor(protected http: HttpClient, public datepipe: DatePipe, private errorHandler: ErrorHandlerService) { }

  // Set Teacher list frpm database for deep copy
  setTeacherList(teacherList: Teacher[]) {
    this.teacherList = teacherList;
    this.teacherListChanged.next(this.teacherList.slice());
  }

  // Get All teachers list
  // @return: Teacher list
  // Setting Teacher list for refresh every specific time
  getAllTeachers() {
    return this.http.get<Teacher[]>(`${this.basePath}/api/Teacher/getAllTeachers`).pipe(map((teacherList: Teacher[]) => {
      return teacherList;
    }),
      tap((teacherList: Teacher[]) => {
        this.setTeacherList(teacherList);
      }),
      catchError(this.errorHandler.errorHandler)
    );
  }

  // Get Number of Teachers
  getNumberOfTeachers() {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.get<number>(`${this.basePath}/api/Teacher/getNumberOfTeachers`)
      .pipe(
        catchError(this.errorHandler.errorHandler)
      )
  }

  // Get teachers details by course name
  getTeachersByCourseName(courseName: string) {
    if (courseName === null || courseName === undefined) {
      throw new Error('Required parameter id was null or undefined when calling getTeacher.');
    }
    return this.http.get<Teacher[]>(`${this.basePath}/api/Teacher/getTeacherByCourse?courseName=${encodeURIComponent(String(courseName))}`).pipe(
      catchError(this.errorHandler.errorHandler)
    )
  }

  //Get teacher detail by teacher Id
  getTeacherById(id: string) {
    if (id === null || id === undefined) {
      throw new Error('Required parameter id was null or undefined when calling getTeacher.');
    }
    return this.http.get<Teacher>(`${this.basePath}/api/Teacher/getTeacherById?id=${encodeURIComponent(String(id))}`).pipe(
      catchError(this.errorHandler.errorHandler)
    )
  }

  //  Delete Teacher porfile by Id
  deleteById(id: string) {
    if (id === null || id === undefined) {
      throw new Error('Required parameter id was null or undefined when calling apiTeacherIdDelete.');
    }
    return this.http.delete<Teacher>(`${this.basePath}/api/Teacher/deleteTeacherById?id=${encodeURIComponent(String(id))}`)
      .pipe(
        catchError(this.errorHandler.errorHandler)
      )
  }

  // Create a new Teacher profile
  create(params: any) {
    if (params.Id === null || params.Id === undefined) {
      throw new Error('Required parameter id was null or undefined when calling apiTeacherCreate.');
    }
    return this.http.post<Teacher>(`${this.basePath}/api/Teacher/createTeacher`, params)
      .pipe(
        catchError(this.errorHandler.errorHandler)
      )
  }

  // Update existed teacher profile
  update(teacherIn: Teacher) {
    if (teacherIn.Id === null || teacherIn.Id === undefined) {
      throw new Error('Required parameter id was null or undefined when calling apiCourseUpdate.');
    }
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<Teacher>(`${this.basePath}/api/Teacher/updateTeacher`, teacherIn)
      .pipe(
        catchError(this.errorHandler.errorHandler)
      )
  }
}
