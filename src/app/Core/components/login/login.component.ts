import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TokenStorageService } from 'src/app/shared/helperServices/token-storage.service';
import { Role } from 'src/app/shared/pipes-and-enum/roleEnum';
import { User } from 'src/services/models/user';
import { UserService } from 'src/services/WebApiService/user.service';
import { ForgotPassComponent } from '../forgot-pass/forgot-pass.component';
import { AlertService } from '../../../shared/helperServices/alert.service';
import { StudentService } from 'src/services/WebApiService/student.service';
import { AdminService } from 'src/services/WebApiService/admin.service';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public loginForm!: FormGroup;
  public hide: boolean = true; // Password hiding
  public isMissing: boolean;
  public isWrong: boolean;
  public isLoginPage: boolean = false;
  public attempts: number = 3;
  public loggedUser: any;
  isLoading = false;

  constructor(private fb: FormBuilder,
    private router: Router,
    private studentService: StudentService,
    private adminService: AdminService,
    private userService: UserService,
    private modalService: NgbModal,
    private tokenStorage: TokenStorageService,
    private alertService: AlertService
  ) { }

  public ngOnInit(): void {
    this.isLoginPage = true;
    this.loginForm = this.fb.group({
      userName: [null, Validators.required],
      password: [null, [Validators.required, Validators.minLength(5),
      Validators.maxLength(10)]],
    });
  }
  // Form Validation
  getValidationErrorMsg() {
    if (this.loginForm.get('password').hasError('minlength'))
      return ' Password must contain at least 5 symbols';
    else if (this.loginForm.get('password').hasError('maxlength'))
      return "Password must be a string with a maximum length of 10";
    else
      return 'Please enter password';
  }
  // Check the user name and password
  public onLogin(): void {
    this.isLoading = true;
    if (this.loginForm.valid) {
      this.markAsDirty(this.loginForm);
      let user: User = {
        UserName: this.loginForm.controls['userName'].value,
        Password: this.loginForm.controls['password'].value
      }
      this.userService.checkAuth(user, this.attempts).subscribe(res => {
        if (res) { // If success, user details will be saved in session storage
          res.Password = user.Password;
          this.tokenStorage.saveUser(res);
          if (res.Role === Role.Admin) {
            this.setUserDetails(Role.Admin);
          }
          else {
            this.setUserDetails(Role.Student);
          }
        }
        else {
          this.isWrong = true;
        }
      },
        err => {// in error, need to check 2 options
          if (this.attempts == 0) {
            this.router.navigate(['../forgot-pass']);
          }
          else {// if password not correct, user have a 3 attempts
            if (err != 'Connection Refused!') {
              this.alertService.genericAlertMsg("error", "Try again! You have " + this.attempts + " attempts left");
              this.attempts--;
              this.isLoading = false;
            }
            else
            {
              this.alertService.genericAlertMsg("error", err + " Please try again later or call to administration");
              this.isLoading = false;
            } // If no connections with server side
            
            this.isWrong = true;
          }
        });
    }
  }

  // check the authorized user Role
  setUserDetails(role: string) {
    if (role == Role.Student) {
      this.studentService.getStudentById(this.tokenStorage.getUser().UserName).subscribe(res => {
        if (res) {
          this.putUserDetails(res, role);
          this.tokenStorage.saveToken("group", res.Group_Id);
          this.router.navigate(['secure/student']);
          this.tokenStorage.saveToken('role', Role.Student);
        }
      })
    }
    else if (role == Role.Admin) {
      this.adminService.getAdminById(this.tokenStorage.getUser().UserName).subscribe(res => {
        if (res) {
          this.putUserDetails(res, role);
          this.router.navigate(['secure/admin']);
          this.tokenStorage.saveToken('role', Role.Admin);
        }
      })
    }
  }

  // Set user details in session storage
  private putUserDetails(detailsObj: any, role: string): any {
    this.loggedUser = {
      First_name: detailsObj.First_name,
      Last_name: detailsObj.Last_name,
      Email: detailsObj.Email,
      Phone: detailsObj.Phone,
      Image: detailsObj.Image,
      Birth_date: detailsObj.Birth_date,
      Id: detailsObj.Id,
      Address: detailsObj.Address,
    }
    if (role === Role.Student)
      this.loggedUser['Group_Id'] = detailsObj.Group_Id;
    this.tokenStorage.saveToken('personal_info', JSON.stringify(this.loggedUser));
  }

  // Form Validation
  private markAsDirty(group: FormGroup): void {
    group.markAsDirty();
    for (const i in group.controls) {
      group.controls[i].markAsDirty();
    }
  }


}


