import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {catchError, map, tap} from 'rxjs/operators';
import { throwError } from 'rxjs';
import { DatePipe } from '@angular/common';

import { environment } from 'src/environments/environment';
import { ExamUtils } from '../utils/examUtils';
import { Exam } from '../models/exam';


@Injectable({
  providedIn: 'root'
})
export class ExamService {
  protected basePath = environment.basePath;;
   
  constructor(protected http: HttpClient, private examUtil: ExamUtils,public datepipe: DatePipe) {}

//function for getting all Exams from web api
  getAllExams(){

    return this.http.get<Exam[]>(`${this.basePath}/api/Exam/getAllExam`).pipe(map( (examList: Exam[])=>{
      return examList;
      
    }),
    
    tap((examList: Exam[]) =>{
      this.examUtil.setexamList(examList);
    })
    );
  }
  //function to get total number of Exams from web api
  getNumberOfExams()
  {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.get<number>(`${this.basePath}/api/Exam/getNumberOfExams`)
    .pipe(
      catchError(this.errorHandler)
    )
  }

//function to get single exam object from web api by given id
  getExamById(id: string){
    if (id === null || id === undefined) {
      throw new Error('Required parameter id was null or undefined when calling getExamById.');
  }
  return this.http.get<Exam>(`${this.basePath}/api/Exam/getExamById?id=${encodeURIComponent(String(id))}`).pipe(
    catchError(this.errorHandler)
  )
 }

 getExamByGroup(groupNumber: string, semester: string, year: string, testNo: string){
   return this.http.get<Exam[]>(`${this.basePath}/api/Exam/getExamByGroup?groupNumber=${encodeURIComponent(String(groupNumber))}&semester=${encodeURIComponent(String(semester))}
   &year=${encodeURIComponent(String(year))}&testNo=${encodeURIComponent(String(testNo))}`)
   .pipe(
    catchError(this.errorHandler))
 }


  //function to delete single exam object with given id

  deleteById(id: string){
    if (id === null || id === undefined) {
      throw new Error('Required parameter id was null or undefined when calling deleteExamById.');
  }
    return this.http.delete<Exam>(`${this.basePath}/api/Exam/deleteExamById?id=${encodeURIComponent(String(id))}`)
    .pipe(
      catchError(this.errorHandler)
    )
  }

//function to add new exam to web api

  create(params: any){
    return this.http.post<Exam>(`${this.basePath}/api/Exam/createExam`, params)
    .pipe(
      catchError(this.errorHandler)
    )
  }


  //update existing exam in web api
  update(examIn: Exam){
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.put<Exam>(`${this.basePath}/api/Exam/updateExam`, examIn)
    .pipe(
      catchError(this.errorHandler)
    )
  }

  //error handler for http response
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
