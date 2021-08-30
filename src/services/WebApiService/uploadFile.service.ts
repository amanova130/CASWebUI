// Opload File service is responsible to upload and download excel files
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import * as XLSX from 'xlsx';
import { ErrorHandlerService } from '../../app/shared/helperServices/errorHandler.service';


@Injectable({
  providedIn: 'root'
})
export class UploadFileService {
  protected basePath = environment.basePath; //Path to connect with Web API

    constructor(protected http: HttpClient, private errorHandlerService: ErrorHandlerService) {  }

    //Funtion to upload image to Web API
    uploadImage(formData: FormData)
    {
      const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  
      return this.http.post(`${this.basePath}/api/FileHandler/UploadImage`, formData)
      .pipe(
        catchError(this.errorHandlerService.errorHandler)
      )
    }

    // Function to Export data to Excel File
    //@param: ClassName that will be exported to Excel
    //@return: File content to Excel
    exportToExcell(className: any): Observable<Blob> 
    {
        return this.http.get<any>(`${this.basePath}/api/FileHandler/exportToExcell?className=${encodeURIComponent(className)}` , { responseType: 'blob' as 'json' });
    }
    exportexcel(table: any, fileName: string): void
    {
      const ws: XLSX.WorkSheet=XLSX.utils.table_to_sheet(table);//converts a DOM TABLE element to a worksheet
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  
      /* save to file */
      XLSX.writeFile(wb, fileName);
  
    }

}