import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {catchError, map, tap} from 'rxjs/operators';
import { throwError } from 'rxjs';
import { DatePipe } from '@angular/common';
import { Faculty } from '../models/faculty';
import { FacultyUtils } from '../utils/facultyUtils';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class FacultyService {
  protected basePath = environment.basePath;;
   
  constructor(protected http: HttpClient, private facultyUtil: FacultyUtils,public datepipe: DatePipe) {}

//function for getting all faculties from web api
  getAllFaculties(){

    return this.http.get<Faculty[]>(`${this.basePath}/api/Faculty/getAllFaculties`).pipe(map( (facultyList: Faculty[])=>{
    
      return facultyList;
    }),
    
    tap((facultyList: Faculty[]) =>{
      this.facultyUtil.setFacultyList(facultyList);
    })
    );
  }
  //function to get total number of faculties from web api
  getNumberOfFaculties()
  {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.get<number>(`${this.basePath}/api/Faculty/getNumberOfFaculties`)
    .pipe(
      catchError(this.errorHandler)
    )
  }

//function to get single faculty object from web api by given id
  getFacultyById(id: string){
    if (id === null || id === undefined) {
      throw new Error('Required parameter id was null or undefined when calling getFacultyById.');
  }
  return this.http.get<Faculty>(`${this.basePath}/api/Faculty/getFacultyById?id=${encodeURIComponent(String(id))}`).pipe(
    catchError(this.errorHandler)
  )
 }


  //function to delete single faculty object with given id

  deleteById(id: string){
    if (id === null || id === undefined) {
      throw new Error('Required parameter id was null or undefined when calling deleteFacultyById.');
  }
    return this.http.delete<Faculty>(`${this.basePath}/api/Faculty/deleteFacById?id=${encodeURIComponent(String(id))}`)
    .pipe(
      catchError(this.errorHandler)
    )
  }

//function to add new faculty to web api

  create(params: any){
    return this.http.post<Faculty>(`${this.basePath}/api/Faculty/createFaculty`, params)
    .pipe(
      catchError(this.errorHandler)
    )
  }


  //update existing faculty in web api
  update(facultyIn: Faculty){
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.put<Faculty>(`${this.basePath}/api/Faculty/updateFaculty`, facultyIn)
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
