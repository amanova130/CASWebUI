import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {catchError, map, tap} from 'rxjs/operators';
import { throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Message } from '../models/message';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  protected basePath = environment.basePath; //Path to connect with Web API


  constructor(  private http: HttpClient) { }

  // Get All student list
  getMessagesByReceiverId(id:string){
    return this.http.get<Message[]>(`${this.basePath}/api/Message/getAllMsgByReceiver?id=${encodeURIComponent(String(id))}`)
    .pipe(
      catchError(this.errorHandler)
    )
  }
  getMessagesBySenderId(id:string){
    return this.http.get<Message[]>(`${this.basePath}/api/Message/getAllMsgBySender?id=${encodeURIComponent(String(id))}`)
    .pipe(
      catchError(this.errorHandler)
    )
  }
  


 

//  Delete Student By Id
 deleteById(id: string){
  if (id === null || id === undefined) {
    throw new Error('Required parameter id was null or undefined when calling apiStudentIdDelete.');
}
  return this.http.delete<Message>(`${this.basePath}/api/Student/deleteStudentById?id=${encodeURIComponent(String(id))}`)
  .pipe(
    catchError(this.errorHandler)
  )
}

// Create a new Student profile
create(params: any){
  if (params === null || params === undefined) {
    throw new Error('Required parameter id was null or undefined when calling apiStudentCreate.');
}
  return this.http.post<Message>(`${this.basePath}/api/Message/sendEmail
  `, params)
  .pipe(
    catchError(this.errorHandler)
  )
}

// Update an existed student profile
update(studentIn:Message){
  const headers = new HttpHeaders({'Content-Type': 'application/json'});
  return this.http.put<Message>(`${this.basePath}/api/Student/updateStudent`, studentIn)
  .pipe(
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


