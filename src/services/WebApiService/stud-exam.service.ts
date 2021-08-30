// Managing students and exams to get average 

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { StudExam } from '../models/studExam';
import { CourseAvg } from '../models/courseAvg';
import { ErrorHandlerService } from '../../app/shared/helperServices/errorHandler.service';

@Injectable({
  providedIn: 'root'
})
export class StudExamService {
  protected basePath = environment.basePath; //Path to connect with Web API

  constructor(private http: HttpClient, private errorHandlerService: ErrorHandlerService) { }

  // Get All student list by exam Id
  getAllStudentsGradeByExamId(examId: string) {
    return this.http.get<StudExam[]>(`${this.basePath}/api/StudExam/getGradesByExamId?examId=${encodeURIComponent(String(examId))}`).pipe(
      catchError(this.errorHandlerService.errorHandler)
    )
  }

  // Get Average by Student Id
  getAvgOfGradesByStudentId(studentId: string, year: string, groupNum: string) {
    return this.http.get<CourseAvg[]>(`${this.basePath}/api/StudExam/getAvgOfGradesByStudentId?studentId=${encodeURIComponent(String(studentId))}
    &year=${encodeURIComponent(String(year))}&groupNumber=${encodeURIComponent(String(groupNum))}`).pipe(
      catchError(this.errorHandlerService.errorHandler)
    )
  }

  // Get grades By Student Id and Year
  getGradesByStudentIdAndYear(studentId: string, year: string) {
    return this.http.get<StudExam[]>(`${this.basePath}/api/StudExam/getGradesByStudentId?studentId=${encodeURIComponent(String(studentId))}&year=${encodeURIComponent(String(year))}`).pipe(
      catchError(this.errorHandlerService.errorHandler)
    )
  }

  // Update an existed student profile
  update(studExamIn: StudExam) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<StudExam>(`${this.basePath}/api/StudExam/updateGrade`, studExamIn)
      .pipe(
        catchError(this.errorHandlerService.errorHandler)
      )
  }

}
