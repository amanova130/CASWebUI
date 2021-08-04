import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertService } from 'src/app/shared/helperServices/alert.service';
import { User } from 'src/services/models/user';
import { UserService } from 'src/services/WebApiService/user.service';
import { ForgotPassComponent } from '../forgot-pass/forgot-pass.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public loginForm!: FormGroup;
  public hide: boolean = true; // Password hiding
  public isMissing:boolean;
  public isWrong:boolean;
  public isLoginPage:boolean=false;
  public attempts:number=3;
  public loggedUser: any;

  constructor(private fb: FormBuilder,
               private router: Router,
               private userService:UserService,
               private modalService: NgbModal,
               private alertService:AlertService
               
               ) { }

  public ngOnInit(): void {
    this.isLoginPage=true;
    this.loginForm = this.fb.group({
      userName: [null, Validators.required],
      password: [null, [Validators.required,Validators.minLength(5),
        Validators.maxLength(10)]],
    });
  }
  public onLogin(): void {
    if(this.loginForm.valid)
    {
    this.markAsDirty(this.loginForm);
    let user:User={
      UserName:this.loginForm.controls['userName'].value,
      Password:this.loginForm.controls['password'].value
    }
    this.userService.checkAuth(user).subscribe(res=>{
          if(res)
              this.router.navigate(['secure/admin']);
          else
            {
             this.isWrong=true;
           }
          },
    err => 
    {
      this.attempts--;
      if(this.attempts == 0)
      {
        this.router.navigate(['../forgot-pass']);

      }
      else
      {
        this.alertService.genericAlertMsg("error","Try again!You have "+this.attempts+ " attempts left");
      this.isWrong=true;
      }

  });
}
    


    // if(this.loginForm.controls['userName'].value == 'admin')
    // this.router.navigate(['secure/admin']);
  }

  private markAsDirty(group: FormGroup): void {
    group.markAsDirty();
    for (const i in group.controls) {
      group.controls[i].markAsDirty();
    }
  }


}
