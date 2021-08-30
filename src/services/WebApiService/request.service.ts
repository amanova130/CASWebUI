// Manage All request from Student
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, tap } from 'rxjs/operators';
import { Subject, throwError } from 'rxjs';
import { DatePipe } from '@angular/common';
import { environment } from 'src/environments/environment';
import { Request } from '../models/request';
import { ErrorHandlerService } from '../../app/shared/helperServices/errorHandler.service';

@Injectable({
  providedIn: 'root'
})
export class RequestService {
  protected basePath = environment.basePath;
  private requestList: Request[] = [];
  requestListChanged = new Subject<Request[]>();

  constructor(protected http: HttpClient, public datepipe: DatePipe, private errorHandlerService: ErrorHandlerService) { }

  // Set Request List for deep copy
  setRequestList(requestList: Request[]) {
    this.requestList = requestList;
    this.requestListChanged.next(this.requestList.slice());
  }

  //Function to get all Requests from web api//  
  getAllRequests() {
    return this.http.get<Request[]>(`${this.basePath}/api/Request/getAllRequests`).pipe(map((requestList: Request[]) => {
      return requestList;
    }),
      tap((requestList: Request[]) => {
        this.setRequestList(requestList);
      }),
      catchError(this.errorHandlerService.errorHandler)
    );
  }

  // Get request by sender Id
  getRequestsListBySenderId(senderId: String) {
    return this.http.get<Request[]>(`${this.basePath}/api/Request/getRequestsListBySenderId?senderId=${encodeURIComponent(String(senderId))}`)
      .pipe(map((requestList: Request[]) => {
        return requestList;
      }),
        tap((requestList: Request[]) => {
          this.setRequestList(requestList);
        }),
        catchError(this.errorHandlerService.errorHandler)
      );
  }

  //function to get single Request object from web api by given id from web api
  getRequestById(id: string) {
    if (id === null || id === undefined) {
      throw new Error('Required parameter id was null or undefined when calling getRequest.');
    }
    return this.http.get<Request>(`${this.basePath}/api/Request/getRequestById?id=${encodeURIComponent(String(id))}`).pipe(
      catchError(this.errorHandlerService.errorHandler)
    )
  }


  //function to delete single Request with given id in web api
  deleteById(id: string) {
    if (id === null || id === undefined) {
      throw new Error('Required parameter id was null or undefined when calling apiRequestIdDelete.');
    }
    return this.http.delete<Request>(`${this.basePath}/api/Request/deleteRequestById?id=${encodeURIComponent(String(id))}`)
      .pipe(
        catchError(this.errorHandlerService.errorHandler)
      )
  }

  //function to add new Request object to web api
  createRequest(params: any) {
    return this.http.post<Request>(`${this.basePath}/api/Request/createNewRequest`, params)
      .pipe(
        catchError(this.errorHandlerService.errorHandler)
      )
  }

  //update existing Request object in web api
  updateRequest(requestIn: Request) {
    if (requestIn.Id === null || requestIn.Id === undefined) {
      throw new Error('Required parameter id was null or undefined when calling apiCourseUpdate.');
    }
    return this.http.put<Request>(`${this.basePath}/api/Request/updateRequest`, requestIn)
      .pipe(
        catchError(this.errorHandlerService.errorHandler)
      )
  }

  // Get count of requests 
  getCountOfNewRequest(value: string) {
    return this.http.get<number>(`${this.basePath}/api/Request/getCountOFNewRequest?fieldName=status_request&value=${encodeURIComponent(String(value))}`)
      .pipe(
        catchError(this.errorHandlerService.errorHandler)
      )
  }

}
