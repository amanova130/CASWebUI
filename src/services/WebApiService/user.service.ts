// Manage all users, retrive password, check password, log-in and log-off time

import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { catchError, map, tap } from 'rxjs/operators';
import { DatePipe } from '@angular/common';
import { environment } from 'src/environments/environment';
import { ErrorHandlerService } from '../../app/shared/helperServices/errorHandler.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  protected basePath = environment.basePath; // Path to connect with Backend
  public attempts: number;

  constructor(protected http: HttpClient, public datepipe: DatePipe, private errorHandler: ErrorHandlerService) { }

  //Retrive data for all users in database
  getAllUsers() {
    return this.http.get<User[]>(`${this.basePath}/api/User/getAllUser`).pipe(
      catchError(this.errorHandler.errorHandler)
    );
  }

  //Get data by user Id
  getUserById(id: string) {
    if (id === null || id === undefined)
      throw new Error('Required parameter id was null or undefined when calling getUser.');
    return this.http.get<User>(`${this.basePath}/api/User/getUserById?id=${encodeURIComponent(String(id))}`).pipe(
      catchError(this.errorHandler.errorHandler)
    );
  }

  //Retrive a user data by user Id 
  getUserByEmail(email: string) {
    if (email === null || email === undefined)
      throw new Error('Required parameter id was null or undefined when calling getUserByEmail.');
    return this.http.get<User>(`${this.basePath}/api/User/getUserByEmail?email=${encodeURIComponent(String(email))}`).pipe(
      catchError(this.errorHandler.errorHandler)
    );
  }

  //Checking entered password from user 
  checkEnteredPWD(enteredPass: string, userId: string) {
    if (enteredPass === null || enteredPass === undefined || userId === undefined || userId === undefined)
      throw new Error('Required parameter id was null or undefined when calling checkEnteredPWD.');
    return this.http.get<boolean>(`${this.basePath}/api/User/checkEnteredPWD?pass=${encodeURIComponent(String(enteredPass))}&userId=${encodeURIComponent(String(userId))}`).pipe(
      catchError(this.errorHandler.errorHandler)
    );
  }

// checking Authentication
  checkAuth(param: User, attempts: number) {
    if (param === null || param === undefined)
      throw new Error('Required parameter id was null or undefined when calling getUser.');
    this.attempts = attempts;
    return this.http.post<User>(`${this.basePath}/api/User/CheckAuth`, param).pipe(
      catchError(this.errorHandler.errorHandler)
    );
  }

  //Reset password
  resetPass(email: string) {
    if (email === null || email === undefined)
      throw new Error('Required parameter id was null or undefined when calling resetPass.');
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let queryParameters = new HttpParams();
    queryParameters = queryParameters.append('email', <any>email);
    return this.http.get<User>(`${this.basePath}/api/User/resetPass`, { params: queryParameters, headers: headers }).pipe(
      catchError(this.errorHandler.errorHandler)
    );
  }

// Update user profile
  updateUser(userIn: User) {
    if (userIn === null || userIn === undefined)
      throw new Error('Required parameter id was null or undefined when calling updateUser.');
    return this.http.put<User>(`${this.basePath}/api/User/updateUser`, userIn)
      .pipe(
        catchError(this.errorHandler.errorHandler)
      );
  }

  //Update log-in time in order to handle changing password every year
  updateLogTime(log: string, userId: string) {
    if (log === null || log === undefined)
      throw new Error('Required parameter id was null or undefined when calling updateUser.');
    return this.http.get<User>(`${this.basePath}/api/User/updateLogTime?id=${encodeURIComponent(String(userId))}&logType=${encodeURIComponent(String(log))}`)
      .pipe(
        catchError(this.errorHandler.errorHandler)
      );
  }
}
