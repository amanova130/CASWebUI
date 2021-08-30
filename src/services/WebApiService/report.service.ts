// Manage Reports service
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { DatePipe } from '@angular/common';
import { environment } from 'src/environments/environment';
import { Average } from '../models/courseAvg';
import { ErrorHandlerService } from '../../app/shared/helperServices/errorHandler.service';


@Injectable({
  providedIn: 'root'
})
export class ReportService {
  protected basePath = environment.basePath;

  constructor(protected http: HttpClient, public datepipe: DatePipe, private errorHandlerService: ErrorHandlerService) { }

  getAvgOfAllTeachers(year: string) {
    return this.http.get<Average[]>(`${this.basePath}/api/Report/getAvgOfAllTeachers?year=${encodeURIComponent(String(year))}`)
      .pipe(
        catchError(this.errorHandlerService.errorHandler)
      )
  }

  // Get Average by Course name
  getAverageByCourse(facId: string, courseName: string) {
    return this.http.get<any>(`${this.basePath}/api/Faculty/getAvgOfFacultiesByCourse?courseName=${encodeURIComponent(String(courseName))}&facId=${encodeURIComponent(String(facId))}`)
      .pipe(
        catchError(this.errorHandlerService.errorHandler)
      )
  }

  // Get Average by Group name
  getAvgByGroup(groupName: string, year: string) {
    return this.http.get<Average[]>(`${this.basePath}/api/Report/getAvgByGroup?groupName=${encodeURIComponent(String(groupName))}&year=${encodeURIComponent(String(year))}`)
      .pipe(
        catchError(this.errorHandlerService.errorHandler)
      )
  }
}