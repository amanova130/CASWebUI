import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/user';
//import { TeacherUtils } from '../utils/teacherUtils';
import {catchError, map, tap} from 'rxjs/operators';
import { throwError } from 'rxjs';
import { DatePipe } from '@angular/common';
import { environment } from 'src/environments/environment';



@Injectable({
  providedIn: 'root'
})
export class UserService {
  protected basePath = environment.basePath; // Path to connect with Backend
   public attempts:number;
  constructor(protected http: HttpClient,public datepipe: DatePipe) {}
  getAllUsers(){
    return this.http.get<User[]>(`${this.basePath}/api/User/getAllUser`).pipe(
        catchError(this.errorHandler)
    );
  }
  getUserById(id:string){
      if(id === null || id === undefined)
      throw new Error('Required parameter id was null or undefined when calling getUser.');

    return this.http.get<User>(`${this.basePath}/api/User/getUserById?id=${encodeURIComponent(String(id))}`).pipe(
        catchError(this.errorHandler)
    );
  }
  getUserByEmail(email:string){
    if(email === null || email === undefined)
    throw new Error('Required parameter id was null or undefined when calling getUserByEmail.');

  return this.http.get<User>(`${this.basePath}/api/User/getUserByEmail?email=${encodeURIComponent(String(email))}`).pipe(
      catchError(this.errorHandler)
  );
}

checkEnteredPWD(enteredPass:string,userId:string)
{
  if(enteredPass === null || enteredPass === undefined || userId === undefined || userId === undefined)
  throw new Error('Required parameter id was null or undefined when calling checkEnteredPWD.');

return this.http.get<boolean>(`${this.basePath}/api/User/checkEnteredPWD?pass=${encodeURIComponent(String(enteredPass))}&userId=${encodeURIComponent(String(userId))}`).pipe(
    catchError(this.errorHandler)
);
}


checkAuth(param:User,attempts:number){
  if(param === null || param === undefined)
  throw new Error('Required parameter id was null or undefined when calling getUser.');
this.attempts=attempts;
return this.http.post<User>(`${this.basePath}/api/User/CheckAuth`,param).pipe(
    catchError(this.errorHandler)
);
}
resetPass(email:string)
{
  if(email === null || email === undefined)
    throw new Error('Required parameter id was null or undefined when calling resetPass.');
    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    let queryParameters = new HttpParams();
    queryParameters=queryParameters.append('email',<any>email);
  return this.http.get<User>(`${this.basePath}/api/User/resetPass`,{params:queryParameters,headers:headers}).pipe(
      catchError(this.errorHandler)
  );
}


  updateUser(userIn:User)
  {
    if(userIn === null || userIn === undefined)
    throw new Error('Required parameter id was null or undefined when calling updateUser.');
    return this.http.put<User>(`${this.basePath}/api/User/updateUser`, userIn)
    .pipe(
      catchError(this.errorHandler)
    );
  }
  updateLogTime(log:string,userId:string)
  {
    if(log === null || log === undefined)
    throw new Error('Required parameter id was null or undefined when calling updateUser.');
    return this.http.get<User>(`${this.basePath}/api/User/updateLogTime?id=${encodeURIComponent(String(userId))}&logType=${encodeURIComponent(String(log))}`)
    .pipe(
      catchError(this.errorHandler)
    );
  }

  // Error Handler for HTTP response
  errorHandler(error: { error: { message: string;Message:string }; status: any; message: any; }) {
    let errorMessage = '';
    if(error.status === 0 && error.error instanceof ProgressEvent) {
      errorMessage = "Connection issues";
    } else  {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(errorMessage);
 }
}
