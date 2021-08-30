// Time-table Service to get Schedule by group
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { TimeTable } from '../models/timeTable';
import { environment } from 'src/environments/environment';
import { ErrorHandlerService } from '../../app/shared/helperServices/errorHandler.service';

@Injectable({
  providedIn: 'root'
})
export class TimeTableService {
  protected basePath = environment.basePath; //Path to connect with Backend

  constructor(private http: HttpClient, private errorHandlerService: ErrorHandlerService) { }

  // Get timeTable for specific group
  // @param: Id of Group
  // @return: Time table for specific group
  getTTByGroupNumber(id: string) {
    if (id === null || id === undefined) {
      throw new Error('Required parameter id was null or undefined when calling getStudent.');
    }
    return this.http.get<TimeTable>(`${this.basePath}/api/TimeTable/getTTByGroup?id=${encodeURIComponent(String(id))}`).pipe(
      catchError(this.errorHandlerService.errorHandler)
    )
  }

}
