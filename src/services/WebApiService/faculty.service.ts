// Manage Faculties
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, tap } from 'rxjs/operators';
import { Subject, throwError } from 'rxjs';
import { DatePipe } from '@angular/common';
import { Faculty } from '../models/faculty';
import { environment } from 'src/environments/environment';
import { ErrorHandlerService } from 'src/app/shared/helperServices/errorHandler.service';

@Injectable({
  providedIn: 'root'
})
export class FacultyService {
  protected basePath = environment.basePath;;
  private facultyList: Faculty[] = [];
  facultyListChanged = new Subject<Faculty[]>();

  constructor(protected http: HttpClient, public datepipe: DatePipe, private errorHandlerService: ErrorHandlerService) { }

  setFacultyList(facultyList: Faculty[]) {
    this.facultyList = facultyList;
    this.facultyListChanged.next(this.facultyList.slice());
  }
  
  //function for getting all faculties from web api
  getAllFaculties() {
    return this.http.get<Faculty[]>(`${this.basePath}/api/Faculty/getAllFaculties`).pipe(map((facultyList: Faculty[]) => {
      return facultyList;
    }),
      tap((facultyList: Faculty[]) => {
        this.setFacultyList(facultyList);
      }),
      catchError(this.errorHandlerService.errorHandler)
    );
  }

  //function to get total number of faculties from web api
  getNumberOfFaculties() {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.get<number>(`${this.basePath}/api/Faculty/getNumberOfFaculties`)
      .pipe(
        catchError(this.errorHandlerService.errorHandler)
      )
  }

  //function to get single faculty object from web api by given id
  getFacultyById(id: string) {
    if (id === null || id === undefined) {
      throw new Error('Required parameter id was null or undefined when calling getFacById.');
    }
    return this.http.get<Faculty>(`${this.basePath}/api/Faculty/getFacById?id=${encodeURIComponent(String(id))}`).pipe(
      catchError(this.errorHandlerService.errorHandler)
    )
  }

  //function to delete single faculty object with given id
  deleteById(id: string) {
    if (id === null || id === undefined) {
      throw new Error('Required parameter id was null or undefined when calling deleteFacById.');
    }
    return this.http.delete<Faculty>(`${this.basePath}/api/Faculty/deleteFacById?id=${encodeURIComponent(String(id))}`)
      .pipe(
        catchError(this.errorHandlerService.errorHandler)
      )
  }

  //function to add new faculty to web api
  create(params: any) {
    return this.http.post<Faculty>(`${this.basePath}/api/Faculty/createFaculty`, params)
      .pipe(
        catchError(this.errorHandlerService.errorHandler)
      )
  }

  // Get Average by course
  getAverageByCourse(facId: string, courseName: string) {
    return this.http.get<any>(`${this.basePath}/api/Faculty/getAvgOfFacultiesByCourse?courseName=${encodeURIComponent(String(courseName))}&facId=${encodeURIComponent(String(facId))}`)
      .pipe(
        catchError(this.errorHandlerService.errorHandler)
      )
  }

  //update existing faculty in web api
  update(facultyIn: Faculty) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<Faculty>(`${this.basePath}/api/Faculty/updateFaculty`, facultyIn)
      .pipe(
        catchError(this.errorHandlerService.errorHandler)
      )
  }
}
