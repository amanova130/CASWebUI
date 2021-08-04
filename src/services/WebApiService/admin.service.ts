import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Admin } from '../models/admin';
import { AdminUtils } from '../utils/adminUtils';
import {catchError, map, tap} from 'rxjs/operators';
import { throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  protected basePath = environment.basePath; //Path to connect with Web API


  constructor(private adminUtils: AdminUtils,  private http: HttpClient) { }

  // Get All student list
  getAllAdmins(){
    return this.http.get<Admin[]>(`${this.basePath}/api/Admin/getAllAdmin`).pipe(map( (adminList: Admin[])=>{
      return adminList;
    }),
    tap((adminList: Admin[]) =>{
      this.adminUtils.setAdminList(adminList);
    })
    );
  }

  

 

  // Get student profile by Id
  getAdminById(id: string){
    if (id === null || id === undefined) {
      throw new Error('Required parameter id was null or undefined when calling getAdmin.');
  }
  return this.http.get<Admin>(`${this.basePath}/api/Admin/getAdminById?id=${encodeURIComponent(String(id))}`).pipe(
    catchError(this.errorHandler)
  )
 }

//  Delete Student By Id
 deleteById(id: string){
  if (id === null || id === undefined) {
    throw new Error('Required parameter id was null or undefined when calling apiAdminIdDelete.');
}
  return this.http.delete<Admin>(`${this.basePath}/api/Admin/deleteAdminById?id=${encodeURIComponent(String(id))}`)
  .pipe(
    catchError(this.errorHandler)
  )
}

// Create a new Student profile
create(params: any){
  if (params.Id === null || params.Id === undefined) {
    throw new Error('Required parameter id was null or undefined when calling apiAdminCreate.');
}
  return this.http.post<Admin>(`${this.basePath}/api/Admin/createNewAdmin`, params)
  .pipe(
    catchError(this.errorHandler)
  )
}

// Update an existed student profile
update(adminIn:Admin){
  const headers = new HttpHeaders({'Content-Type': 'application/json'});
  return this.http.put<Admin>(`${this.basePath}/api/Admin/updateAdmin`, adminIn)
  .pipe(
    catchError(this.errorHandler)
  )
}

// Error handler for HTTP response
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


