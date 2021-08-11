import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { StudExam } from '../models/studExam';

@Injectable({
  providedIn: 'root'
})
export class StudExamService {
  protected basePath = environment.basePath; //Path to connect with Web API
  
  constructor(private http: HttpClient) { }

   // Get All student list
   getAllStudentsGradeByExamId(examId: string){
    return this.http.get<StudExam[]>(`${this.basePath}/api/StudExam/getGradesByExamId?examId=${encodeURIComponent(String(examId))}`).pipe(
      catchError(this.errorHandler)
    )
  }

  // Error handler for HTTP response
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
