import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Group } from '../models/group';
import { FacultyUtils } from '../utils/facultyUtils';
import {catchError, map, tap} from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Faculty } from '../models/faculty';

@Injectable({
  providedIn: 'root'
})
export class FacultyService {
  protected basePath = 'https://localhost:5001';

  constructor(private facultyUtils: FacultyUtils,  private http: HttpClient) { }

  getAllFaculties(){
    return this.http.get<Faculty[]>('https://localhost:5001/api/Faculty/getAllFaculties').pipe(map( (facultyList: Faculty[])=>{
      return facultyList;
    }),
    tap((facultyList: Faculty[]) =>{
      this.facultyUtils.setFacultyList(facultyList);
    })
    );
  }

  getFacultyById(id: string){
    if (id === null || id === undefined) {
      throw new Error('Required parameter id was null or undefined when calling getFaculty.');
  }
  return this.http.get<Faculty>(`${this.basePath}/api/Faculty/${encodeURIComponent(String(id))}`).pipe(
    catchError(this.errorHandler)
  )
 }

 deleteById(id: string){
  if (id === null || id === undefined) {
    throw new Error('Required parameter id was null or undefined when calling apiGroupIdDelete.');
}
  return this.http.delete<Faculty>(`${this.basePath}/api/Faculty/deleteFacultyById?id=${encodeURIComponent(String(id))}`)
  .pipe(
    catchError(this.errorHandler)
  )
}

create(params: any){
  if (params.Id === null || params.Id === undefined) {
    throw new Error('Required parameter id was null or undefined when calling apiCourseCreate.');
}
  return this.http.post<Faculty>(`${this.basePath}/api/Faculty/createFaculty
  `, params)
  .pipe(
    catchError(this.errorHandler)
  )
}


update(facultyIn:Faculty){
  const headers = new HttpHeaders({'Content-Type': 'application/json'});
  return this.http.put<Faculty>(`${this.basePath}/api/Faculty/updateFaculty`, facultyIn)
  .pipe(
    catchError(this.errorHandler)
  )
}

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
