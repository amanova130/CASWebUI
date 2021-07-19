import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import {catchError, map, tap} from 'rxjs/operators';
import { throwError } from 'rxjs';
import { DatePipe } from '@angular/common';
import { HolidayUtils } from '../utils/holidayUtils';
import { Holiday } from '../models/holiday';


@Injectable({
  providedIn: 'root'
})
export class HolidayService {
  protected basePath = 'https://localhost:5001';
   
  constructor(protected http: HttpClient, private holidayUtil: HolidayUtils, public datepipe: DatePipe) {}

  //Function to get all holidays from web api//  
  getAllHolidays(){

    return this.http.get<Holiday[]>(`${this.basePath}/api/Holiday/getAllholidays`).pipe(map( (holidayList: Holiday[])=>{
    
      return holidayList;
    }),
    
    tap((HolidayList: Holiday[]) =>{
      this.holidayUtil.setHolidayList(HolidayList);
    })
    );
  }

//function to get single holiday object from web api by given id from web api
  getHolidayById(id: string){
    if (id === null || id === undefined) {
      throw new Error('Required parameter id was null or undefined when calling getHoliday.');
  }
  return this.http.get<Holiday>(`${this.basePath}/api/Holiday/getHolidayById?id=${encodeURIComponent(String(id))}`).pipe(
    catchError(this.errorHandler)
  )
 }


 //function to delete single holiday with given id in web api
  deleteById(id: string){
    if (id === null || id === undefined) {
      throw new Error('Required parameter id was null or undefined when calling apiHolidayIdDelete.');
  }
    return this.http.delete<Holiday>(`${this.basePath}/api/Holiday/deleteHolidayById?id=${encodeURIComponent(String(id))}`)
    .pipe(
      catchError(this.errorHandler)
    )
  }

//function to add new holiday object to web api
  create(params: any){
    if (params.Id === null || params.Id === undefined) {
      throw new Error('Required parameter id was null or undefined when calling apiHolidayCreate.');
  }
    return this.http.post<Holiday>(`${this.basePath}/api/Holiday/createHoliday`, params)
    .pipe(
      catchError(this.errorHandler)
    )
  }

  //update existing holiday object in web api
  update(HolidayIn: Holiday){
    if (HolidayIn.Id === null || HolidayIn.Id === undefined) {
      throw new Error('Required parameter id was null or undefined when calling apiCourseUpdate.');
  }
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.put<Holiday>(`${this.basePath}/api/Holiday/updateHoliday`, HolidayIn)
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
