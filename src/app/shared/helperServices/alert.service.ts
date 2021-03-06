// Alert Service - contain all alert messages properties
import { Injectable } from '@angular/core';
import Swal, { SweetAlertIcon } from 'sweetalert2';

@Injectable({ providedIn: 'root' })
export class AlertService {

  public successResponseFromDataBase() {
    Swal.fire({
      icon: 'success',
      text: 'Records Updated',
      showConfirmButton: false,
      timer: 1500
    })
  }

  public errorResponseFromDataBase() {
    Swal.fire({
      icon: 'error',
      text: 'Something went wrong, please try again!',
      showConfirmButton: false,
      timer: 1500
    })
  }

  public errorFormField() {
    Swal.fire({
      icon: 'error',
      text: 'Please fill the required fields!',
    })
  }

  public genericAlertMsg(icon: SweetAlertIcon, msg: string) {
    Swal.fire({
      icon: icon,
      text: msg,
    })
  }

}