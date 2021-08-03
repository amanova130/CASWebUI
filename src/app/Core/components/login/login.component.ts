import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
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
    this.userService.getUserById(this.loginForm.controls['userName'].value).subscribe(res=>{
          if(res)
          {
            if(this.loginForm.controls['password'].value == res.Password )
            {
              this.router.navigate(['secure/admin']);
              localStorage.setItem('userId', res.UserName);
              localStorage.setItem('userRole', res.Role);
            }
            else
            {
             this.isWrong=true;
           }
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
      this.isWrong=true;
     });
  }
  }

  private markAsDirty(group: FormGroup): void {
    group.markAsDirty();
    for (const i in group.controls) {
      group.controls[i].markAsDirty();
    }
  }


}
