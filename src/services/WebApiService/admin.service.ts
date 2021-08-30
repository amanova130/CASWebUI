// Manage Admins
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Admin } from '../models/admin';
import { catchError, map, tap } from 'rxjs/operators';
import { Subject, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ErrorHandlerService } from 'src/app/shared/helperServices/errorHandler.service';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  protected basePath = environment.basePath; //Path to connect with Web API
  private adminList: Admin[] = [];
  adminListChanged = new Subject<Admin[]>();

  constructor(private http: HttpClient, private errorHandlerService: ErrorHandlerService) { }

  setAdminList(adminList: Admin[]) {
    this.adminList = adminList;
    this.adminListChanged.next(this.adminList.slice());
  }

  // Get All student list
  getAllAdmins() {
    return this.http.get<Admin[]>(`${this.basePath}/api/Admin/getAllAdmin`).pipe(map((adminList: Admin[]) => {
      return adminList;
    }),
      tap((adminList: Admin[]) => {
        this.setAdminList(adminList);
      })
    );
  }

  // Get student profile by Id
  getAdminById(id: string) {
    if (id === null || id === undefined) {
      throw new Error('Required parameter id was null or undefined when calling getAdmin.');
    }
    return this.http.get<Admin>(`${this.basePath}/api/Admin/getAdminById?id=${encodeURIComponent(String(id))}`).pipe(
      catchError(this.errorHandlerService.errorHandler)
    )
  }

  //  Delete Student By Id
  deleteById(id: string) {
    if (id === null || id === undefined) {
      throw new Error('Required parameter id was null or undefined when calling apiAdminIdDelete.');
    }
    return this.http.delete<Admin>(`${this.basePath}/api/Admin/deleteAdminById?id=${encodeURIComponent(String(id))}`)
      .pipe(
        catchError(this.errorHandlerService.errorHandler)
      )
  }

  // Create a new Student profile
  create(params: any) {
    if (params.Id === null || params.Id === undefined) {
      throw new Error('Required parameter id was null or undefined when calling apiAdminCreate.');
    }
    return this.http.post<Admin>(`${this.basePath}/api/Admin/createNewAdmin`, params)
      .pipe(
        catchError(this.errorHandlerService.errorHandler)
      )
  }

  // Update an existed student profile
  update(adminIn: Admin) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<Admin>(`${this.basePath}/api/Admin/updateAdmin`, adminIn)
      .pipe(
        catchError(this.errorHandlerService.errorHandler)
      )
  }
}


