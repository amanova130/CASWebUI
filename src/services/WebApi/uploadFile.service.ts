import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';



@Injectable({
  providedIn: 'root'
})
export class UploadFileService {
  protected basePath = 'https://localhost:5001';
  
    constructor(protected http: HttpClient) {  }
    uploadImage(formData: FormData)
    {
      const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  
      return this.http.post(`${this.basePath}/api/FileHandler/UploadImage`, formData)
      .pipe(
        catchError(this.errorHandler)
      )
    }

    exportToExcell(className: any): Observable<Blob> 
    {
        return this.http.get<any>(`${this.basePath}/api/FileHandler/exportToExcell?className=${encodeURIComponent(className)}` , { responseType: 'blob' as 'json' });
        
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