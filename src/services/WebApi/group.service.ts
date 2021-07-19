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
  
  //Function to get all groups from web api
  getAllGroups(){
    return this.http.get<Group[]>(`${this.basePath}/api/Group/getAllGroups`).pipe(map( (groupList: Group[])=>{
      return groupList;
    }),
    tap((groupList: Group[]) =>{
      this.groupUtils.setGroupList(groupList);
    })
    );
  }

 //function to get total number of groups from web api
  getNumberOfGroups()
  {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.get<number>(`${this.basePath}/api/Group/getNumberOfGroups`)
    .pipe(
      catchError(this.errorHandler)
    )
  }

//function to get single group from web api by given id
  getGroupById(id: string){
    if (id === null || id === undefined) {
      throw new Error('Required parameter id was null or undefined when calling getStudent.');
  }
  return this.http.get<Group>(`${this.basePath}/api/Group/${encodeURIComponent(String(id))}`).pipe(
    catchError(this.errorHandler)
  )
 }

  //function to delete single group with given id
 deleteById(id: string){
  if (id === null || id === undefined) {
    throw new Error('Required parameter id was null or undefined when calling apiGroupIdDelete.');
}
  return this.http.delete<Group>(`${this.basePath}/api/Group/deleteGroupById?id=${encodeURIComponent(String(id))}`)
  .pipe(
    catchError(this.errorHandler)
  )
}

//function to add new group to web api
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

  //update existing group in web api
update(groupIn:Group){
  console.log(groupIn);

  const headers = new HttpHeaders({'Content-Type': 'application/json'});
  return this.http.put<Group>(`${this.basePath}/api/Group/updateGroup`, groupIn)
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
