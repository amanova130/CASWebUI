// Manage Exams
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, tap } from 'rxjs/operators';
import { Subject, throwError } from 'rxjs';
import { DatePipe } from '@angular/common';
import { environment } from 'src/environments/environment';
import { Exam } from '../models/exam';
import { ErrorHandlerService } from 'src/app/shared/helperServices/errorHandler.service';


@Injectable({
  providedIn: 'root'
})
export class ExamService {
  protected basePath = environment.basePath;;
  private examList: Exam[] = [];
  examListChanged = new Subject<Exam[]>();

  constructor(protected http: HttpClient, public datepipe: DatePipe, private errorHandlerService: ErrorHandlerService) { }
  setexamList(examList: Exam[]) {
    this.examList = examList;
    this.examListChanged.next(this.examList.slice());
  }

  //function for getting all Exams from web api
  getAllExams() {
    return this.http.get<Exam[]>(`${this.basePath}/api/Exam/getAllExam`).pipe(map((examList: Exam[]) => {
      return examList;
    }),
      tap((examList: Exam[]) => {
        this.setexamList(examList);
      }),
      catchError(this.errorHandlerService.errorHandler)
    );
  }

  //function to get total number of Exams from web api
  getNumberOfExams() {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.get<number>(`${this.basePath}/api/Exam/getNumberOfExams`)
      .pipe(
        catchError(this.errorHandlerService.errorHandler)
      )
  }

  //function to get single exam object from web api by given id
  getExamById(id: string) {
    if (id === null || id === undefined) {
      throw new Error('Required parameter id was null or undefined when calling getExamById.');
    }
    return this.http.get<Exam>(`${this.basePath}/api/Exam/getExamById?id=${encodeURIComponent(String(id))}`).pipe(
      catchError(this.errorHandlerService.errorHandler)
    )
  }

  // Get list of exams by group number
  getExamByGroup(groupNumber: string, semester: string, year: string, testNo: string) {
    return this.http.get<Exam[]>(`${this.basePath}/api/Exam/getExamByGroup?groupNumber=${encodeURIComponent(String(groupNumber))}&semester=${encodeURIComponent(String(semester))}
   &year=${encodeURIComponent(String(year))}&testNo=${encodeURIComponent(String(testNo))}`)
      .pipe(
        catchError(this.errorHandlerService.errorHandler))
  }

  //function to delete single exam object with given id
  deleteById(id: string) {
    if (id === null || id === undefined) {
      throw new Error('Required parameter id was null or undefined when calling deleteExamById.');
    }
    return this.http.delete<Exam>(`${this.basePath}/api/Exam/deleteExamById?id=${encodeURIComponent(String(id))}`)
      .pipe(
        catchError(this.errorHandlerService.errorHandler)
      )
  }

  //function to add new exam to web api
  create(params: any) {
    return this.http.post<Exam>(`${this.basePath}/api/Exam/createExam`, params)
      .pipe(
        catchError(this.errorHandlerService.errorHandler)
      )
  }

  //update existing exam in web api
  update(examIn: Exam) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<Exam>(`${this.basePath}/api/Exam/updateExam`, examIn)
      .pipe(
        catchError(this.errorHandlerService.errorHandler)
      )
  }

}
