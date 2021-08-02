import { Injectable } from '@angular/core';
import Swal, { SweetAlertIcon } from 'sweetalert2';



@Injectable({ providedIn: 'root' })
export class AlertService {

public successResponseFromDataBase(){
        Swal.fire({
          icon: 'success',
          text: 'Successfully Done',
        })
    }

public errorResponseFromDataBase(){
      Swal.fire({
        icon: 'error',
        text: 'Something went wrong, please try again!',
      })
  }

  public errorFormField(){
    Swal.fire({
      icon: 'error',
      text: 'Please fill the required fields!',
    })
}

public genericAlertMsg(icon: SweetAlertIcon, msg: string){
  Swal.fire({
    icon: icon,
    text: msg,
  })
}

}