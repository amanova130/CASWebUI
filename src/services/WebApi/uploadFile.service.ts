import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';



@Injectable({
  providedIn: 'root'
})
export class UploadFileService {
  protected basePath = environment.basePath; //Path to connect with Web API
    constructor(protected http: HttpClient) {  }

    //Funtion to upload image to Web API
    uploadImage(formData: FormData)
    {
      const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  
      return this.http.post(`${this.basePath}/api/FileHandler/UploadImage`, formData)
      .pipe(
        catchError(this.errorHandler)
      )
    }

    // Function to Export data to Excel File
    //@param: ClassName that will be exported to Excel
    //@return: File content to Excel
    exportToExcell(className: any): Observable<Blob> 
    {
        return this.http.get<any>(`${this.basePath}/api/FileHandler/exportToExcell?className=${encodeURIComponent(className)}` , { responseType: 'blob' as 'json' });
    }


    //Error Handler for HTTP response
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