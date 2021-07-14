import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { filter } from 'rxjs/operators';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { Alert, AlertType } from '../models/alert';



@Injectable({ providedIn: 'root' })
export class AlertService {
    openAlertMsg(icon: SweetAlertIcon, msg: string){
        Swal.fire({
          icon: icon,
          text: msg,
        })
    }
}