import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Teacher } from '../models/teacher';
import { TeacherUtils } from '../utils/teacherUtils';
import {catchError, map, tap} from 'rxjs/operators';
import { throwError } from 'rxjs';
import { DatePipe } from '@angular/common';
import { environment } from 'src/environments/environment';



@Injectable({
  providedIn: 'root'
})
export class TeacherService {
  protected basePath = environment.basePath; // Path to connect with Backend
   
  constructor(protected http: HttpClient, private teachersUtil: TeacherUtils,public datepipe: DatePipe) {}

// Get All teachers list
// @return: Teacher list
// Setting Teacher list for refresh every specific time
  getAllTeachers(){
    return this.http.get<Teacher[]>(`${this.basePath}/api/Teacher/getAllTeachers`).pipe(map( (teacherList: Teacher[])=>{
      return teacherList;
    }),
    tap((teacherList: Teacher[]) =>{
      this.teachersUtil.setTeacherList(teacherList);
    })
    );
  }

  // Get Number of Teachers
  getNumberOfTeachers()
  {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.get<number>(`${this.basePath}/api/Teacher/getNumberOfTeachers`)
    .pipe(
      catchError(this.errorHandler)
    )
  }

// Get Teacher Profile by Id
  getTeacherById(id: string){
    if (id === null || id === undefined) {
      throw new Error('Required parameter id was null or undefined when calling getTeacher.');
  }
  return this.http.get<Teacher>(`${this.basePath}/api/Teacher/getTeacherById?id=${encodeURIComponent(String(id))}`).pipe(
    catchError(this.errorHandler)
  )
 }

//  Delete Teacher porfile by Id
  deleteById(id: string){
    if (id === null || id === undefined) {
      throw new Error('Required parameter id was null or undefined when calling apiTeacherIdDelete.');
  }
    return this.http.delete<Teacher>(`${this.basePath}/api/Teacher/deleteTeacherById?id=${encodeURIComponent(String(id))}`)
    .pipe(
      catchError(this.errorHandler)
    )
  }

// Create a new Teacher profile
  create(params: any){
    if (params.Id === null || params.Id === undefined) {
      throw new Error('Required parameter id was null or undefined when calling apiTeacherCreate.');
  }
    return this.http.post<Teacher>(`${this.basePath}/api/Teacher/createTeacher`, params)
    .pipe(
      catchError(this.errorHandler)
    )
  }

  // Update existed teacher profile
  update(teacherIn: Teacher){
    if (teacherIn.Id === null || teacherIn.Id === undefined) {
      throw new Error('Required parameter id was null or undefined when calling apiCourseUpdate.');
  }
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.put<Teacher>(`${this.basePath}/api/Teacher/updateTeacher`, teacherIn)
    .pipe(
      catchError(this.errorHandler)
    )
  }

  // Error Handler for HTTP response
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
