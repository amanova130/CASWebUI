import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertService } from 'src/app/shared/helperServices/alert.service';
import { Message } from 'src/services/models/message';
import { MessageService } from 'src/services/WebApiService/message.service';
import { UserService } from 'src/services/WebApiService/user.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-forgot-pass',
  templateUrl: './forgot-pass.component.html',
  styleUrls: ['./forgot-pass.component.scss']
})
export class ForgotPassComponent implements OnInit {
  public forgetForm!: FormGroup;

  constructor(private fb: FormBuilder,
              private userService:UserService,
              private messageService:MessageService,
              private alertService:AlertService,
              private router: Router) 
              { }

  public ngOnInit(): void {
    this.forgetForm = this.fb.group({
      email: [null, [Validators.required]],
    });
  }

  public onForget(): void {
    this.markAsDirty(this.forgetForm);
    this.userService.resetPass(this.forgetForm.controls['email'].value).subscribe(res=>{
      if(res)
      {
        this.alertService.genericAlertMsg("success","A message containing information about the password was sent to the specified email address."
                                         +"If you do not receive this message, please check the correctness of the entered email address, or contact the secretariat")
        this.router.navigate(['../login']);
      }
 },
 err=>{
   this.alertService.genericAlertMsg("error","The email address is not found on this database.")
 });
    
  }

  private markAsDirty(group: FormGroup): void {
    group.markAsDirty();
    // tslint:disable-next-line:forin
    for (const i in group.controls) {
      group.controls[i].markAsDirty();
    }
  }
}
