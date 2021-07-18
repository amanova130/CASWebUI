import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Group } from '../models/group';
import { GroupUtils } from '../utils/groupUtils';
import {catchError, map, tap} from 'rxjs/operators';
import { throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  protected basePath = environment.basePath;;

  constructor(private groupUtils: GroupUtils,  private http: HttpClient) { }

  getAllGroups(){
    return this.http.get<Group[]>(`${this.basePath}/api/Group/getAllGroups`).pipe(map( (groupList: Group[])=>{
      return groupList;
    }),
    tap((groupList: Group[]) =>{
      this.groupUtils.setGroupList(groupList);
    })
    );
  }

  getNumberOfGroups()
  {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.get<number>(`${this.basePath}/api/Group/getNumberOfGroups`)
    .pipe(
      catchError(this.errorHandler)
    )
  }

  getGroupById(id: string){
    if (id === null || id === undefined) {
      throw new Error('Required parameter id was null or undefined when calling getStudent.');
  }
  return this.http.get<Group>(`${this.basePath}/api/Group/${encodeURIComponent(String(id))}`).pipe(
    catchError(this.errorHandler)
  )
 }

 deleteById(id: string){
  if (id === null || id === undefined) {
    throw new Error('Required parameter id was null or undefined when calling apiGroupIdDelete.');
}
  return this.http.delete<Group>(`${this.basePath}/api/Group/deleteGroupById?id=${encodeURIComponent(String(id))}`)
  .pipe(
    catchError(this.errorHandler)
  )
}

create(params: any){
  if (params.Id === null || params.Id === undefined) {
    throw new Error('Required parameter id was null or undefined when calling apiStudentCreate.');
}
  return this.http.post<Group>(`${this.basePath}/api/Group/createGroup
  `, params)
  .pipe(
    catchError(this.errorHandler)
  )
}


update(groupIn:Group){
  console.log(groupIn);

  const headers = new HttpHeaders({'Content-Type': 'application/json'});
  return this.http.put<Group>(`${this.basePath}/api/Group/updateGroup`, groupIn)
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
