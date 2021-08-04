import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {catchError, map, tap} from 'rxjs/operators';
import { throwError } from 'rxjs';
import { DatePipe } from '@angular/common';
import { environment } from 'src/environments/environment';
import { RequestUtils } from '../utils/requestUtils';
import { Request } from '../models/request';



@Injectable({
  providedIn: 'root'
})
export class RequestService {
  protected basePath = environment.basePath;
   
  constructor(protected http: HttpClient, private requestUtil: RequestUtils, public datepipe: DatePipe) {}

  //Function to get all Requests from web api//  
  getAllRequests(){

    return this.http.get<Request[]>(`${this.basePath}/api/Request/getAllRequests`).pipe(map( (requestList: Request[])=>{
    
      return requestList;
    }),
    
    tap((requestList: Request[]) =>{
      this.requestUtil.setRequestList(requestList);
    })
    );
  }

//function to get single Request object from web api by given id from web api
  getRequestById(id: string){
    if (id === null || id === undefined) {
      throw new Error('Required parameter id was null or undefined when calling getRequest.');
  }
  return this.http.get<Request>(`${this.basePath}/api/Request/getRequestById?id=${encodeURIComponent(String(id))}`).pipe(
    catchError(this.errorHandler)
  )
 }


 //function to delete single Request with given id in web api
  deleteById(id: string){
    if (id === null || id === undefined) {
      throw new Error('Required parameter id was null or undefined when calling apiRequestIdDelete.');
  }
    return this.http.delete<Request>(`${this.basePath}/api/Request/deleteRequestById?id=${encodeURIComponent(String(id))}`)
    .pipe(
      catchError(this.errorHandler)
    )
  }

//function to add new Request object to web api
  createRequest(params: any){
    return this.http.post<Request>(`${this.basePath}/api/Request/createNewRequest`, params)
    .pipe(
      catchError(this.errorHandler)
    )
  }

  //update existing Request object in web api
  updateRequest(requestIn: Request){
    if (requestIn.Id === null || requestIn.Id === undefined) {
      throw new Error('Required parameter id was null or undefined when calling apiCourseUpdate.');
  }
    return this.http.put<Request>(`${this.basePath}/api/Request/updateRequest`, requestIn)
    .pipe(
      catchError(this.errorHandler)
    )
  }

  getCountOfNewRequest(value: string){
    return this.http.get<number>(`${this.basePath}/api/Request/getCountOFNewRequest?fieldName=status_request&value=${encodeURIComponent(String(value))}`)
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
