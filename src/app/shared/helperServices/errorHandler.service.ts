// Error Handler Service - handling Server and Client side errors
import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';


@Injectable({
    providedIn: 'root'
})
export class ErrorHandlerService {
    public errorMessage: string = '';

    errorHandler(error: HttpErrorResponse) {
        if (error.error instanceof ProgressEvent) {
            if (error.status === 0) {
                this.errorMessage = "Connection Refused!";
            }
            else {
                this.errorMessage = `Error Code: ${error.status}\nMessage: ${error.error}`;
            }
        }
        else {
            let msg = error.error.Message ? error.error.Message : error.error;
            this.errorMessage = `Error Code: ${error.status}\nMessage: ${msg}`;
        }

        return throwError(this.errorMessage);
    }
}