import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Teacher } from '../models/teacher';
import { TeacherUtils } from '../utils/teacherUtils';
import {catchError, map, tap} from 'rxjs/operators';
import { throwError } from 'rxjs';
import { DatePipe } from '@angular/common';
import { CustomHttpUrlEncodingCodec } from '../helperServices/encoder';


@Injectable({
  providedIn: 'root'
})
export class TeacherService {
  protected basePath = 'https://localhost:5001';
   
  constructor(protected http: HttpClient, private teachersUtil: TeacherUtils,public datepipe: DatePipe) {}


  getAllTeachers(){

    return this.http.get<Teacher[]>(`${this.basePath}/api/Teacher/getAllTeachers`).pipe(map( (teacherList: Teacher[])=>{
    
      return teacherList;
    }),
    
    tap((teacherList: Teacher[]) =>{
      this.teachersUtil.setTeacherList(teacherList);
    })
    );
  }

  getTeacherById(id: string){
    if (id === null || id === undefined) {
      throw new Error('Required parameter id was null or undefined when calling getTeacher.');
  }
  return this.http.get<Teacher>(`${this.basePath}/api/Teacher/getTeacherById/${encodeURIComponent(String(id))}`).pipe(
    catchError(this.errorHandler)
  )
 }

  deleteById(id: string){
    if (id === null || id === undefined) {
      throw new Error('Required parameter id was null or undefined when calling apiTeacherIdDelete.');
  }
    return this.http.delete<Teacher>(`${this.basePath}/api/Teacher/deleteTeacherById/${encodeURIComponent(String(id))}`)
    .pipe(
      catchError(this.errorHandler)
    )
  }


  create(params: any){
    if (params.Id === null || params.Id === undefined) {
      throw new Error('Required parameter id was null or undefined when calling apiTeacherCreate.');
  }
    return this.http.post<Teacher>(`${this.basePath}/api/Teacher/createTeacher`, params)
    .pipe(
      catchError(this.errorHandler)
    )
  }

  update(teacherIn: Teacher){
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.put<Teacher>(`${this.basePath}/api/Teacher/updateTeacher`, teacherIn)
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
