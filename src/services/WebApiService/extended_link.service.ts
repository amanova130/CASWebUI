import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable, Optional } from '@angular/core';
import {catchError, map, tap} from 'rxjs/operators';
import { Observable, pipe, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ExtendedLink } from '../models/extended_link';
import { ExtendedLinkUtils } from '../utils/extended_linkUtils';



@Injectable({
  providedIn: 'root'
})
export class ExtendedLinkService {
  protected basePath = environment.basePath;
  
    constructor(protected http: HttpClient, private linkUtils: ExtendedLinkUtils) {  }
   
  //Function to get all Links from web api//  
  getAllLinks(){
  
    return this.http.get<ExtendedLink[]>(`${this.basePath}/api/Extended_link/getAllLinks`).pipe(map( (linkList: ExtendedLink[])=>{
      return linkList;
    }),
    tap((linkList: ExtendedLink[]) =>{
      this.linkUtils.setLinkList(linkList);
    })
    );
  }


//function to get single Link from web api by given id
  getLinkById(id: string){
    if (id === null || id === undefined) {
      throw new Error('Required parameter id was null or undefined when calling getLink.');
  }
  return this.http.get<ExtendedLink>(`${this.basePath}/api/Extended_link/getLinkById?id=${encodeURIComponent(String(id))}`).pipe(
    catchError(this.errorHandler)
  )
 }

 //function to delete single Link with given id
  deleteById(id: string){
    if (id === null || id === undefined) {
      throw new Error('Required parameter id was null or undefined when calling apiLinkIdDelete.');
  }
    return this.http.delete<ExtendedLink>(`${this.basePath}/api/Extended_link/deleteLinkById?id=${encodeURIComponent(String(id))}`)
    .pipe(
      catchError(this.errorHandler)
    )
  }

//function to add new Link to web api
  create(params: any){
    return this.http.post<ExtendedLink>(`${this.basePath}/api/Extended_link/createNewLink`, params)
    .pipe(
      catchError(this.errorHandler)
    )
  }

  //update existing Link in web api
  update(params: ExtendedLink){
    if (params.Id === null || params.Id === undefined) {
      throw new Error('Required parameter id was null or undefined when calling apiLinkUpdate.');
  }
  const headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.put<ExtendedLink>(`${this.basePath}/api/Extended_link/updateLink`, params)
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