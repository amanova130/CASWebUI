// Manage email service 

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Message } from '../models/message';
import { ErrorHandlerService } from 'src/app/shared/helperServices/errorHandler.service';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  protected basePath = environment.basePath; //Path to connect with Web API


  constructor(private http: HttpClient, private errorHandlerService: ErrorHandlerService) { }

  // Get All message list
  getMessagesByReceiverId(id: string) {
    return this.http.get<Message[]>(`${this.basePath}/api/Message/getAllMsgByReceiver?id=${encodeURIComponent(String(id))}`)
      .pipe(
        catchError(this.errorHandlerService.errorHandler)
      )
  }
  
  getMessagesBySenderId(id: string) {
    return this.http.get<Message[]>(`${this.basePath}/api/Message/getAllMsgBySender?id=${encodeURIComponent(String(id))}`)
      .pipe(
        catchError(this.errorHandlerService.errorHandler)
      )
  }

  //  Delete message By Id
  deleteById(id: string) {
    if (id === null || id === undefined) {
      throw new Error('Required parameter id was null or undefined when calling apiStudentIdDelete.');
    }
    return this.http.delete<Message>(`${this.basePath}/api/Message/deleteMsgById?id=${encodeURIComponent(String(id))}`)
      .pipe(
        catchError(this.errorHandlerService.errorHandler)
      )
  }

  // Create a new message profile
  create(params: any) {
    if (params === null || params === undefined) {
      throw new Error('Required parameter id was null or undefined when calling apiStudentCreate.');
    }
    return this.http.post<Message>(`${this.basePath}/api/Message/sendEmail
  `, params)
      .pipe(
        catchError(this.errorHandlerService.errorHandler)
      )
  }

// Get deleted emails by sender Id
  GetAllDeletedBySender(id: string) {
    return this.http.get<Message[]>(`${this.basePath}/api/Message/getAllDeletedBySender?id=${encodeURIComponent(String(id))}`)
      .pipe(
        catchError(this.errorHandlerService.errorHandler)
      )

  }
  // Update an existed message profile
  update(studentIn: Message) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<Message>(`${this.basePath}/api/Student/updateStudent`, studentIn)
      .pipe(
        catchError(this.errorHandlerService.errorHandler)
      )
  }


}


