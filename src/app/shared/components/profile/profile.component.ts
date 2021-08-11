import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AdminService } from 'src/services/WebApiService/admin.service';
import { AlertService } from '../../helperServices/alert.service';
import { StudentService } from '../../../../services/WebApiService/student.service';
import { User } from 'src/services/models/user';
import { Admin } from '../../../../services/models/admin';
import { Role } from '../../pipes-and-enum/roleEnum';
import { UploadFileService } from '../../../../services/WebApiService/uploadFile.service';
import { first } from 'rxjs/operators';
import { UserService } from 'src/services/WebApiService/user.service';
import { Form } from '@angular/forms';
import { TokenStorageService } from '../../helperServices/token-storage.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  @ViewChild('form') form!: any;

  @Input() public user: User;
  userProfile: any;
  isLoading = false;
  showPasswordField = false;
  newPWD: string="";
  confirmPWD: string="";
  currentPWD: string="";
  icon: string;
  isStudent = false;
  isAdmin = false;
  isCurrent=true;
  isConfirmed=true;
  isCorrectFormat=true;
  isSame=true;


  constructor(public activeModal: NgbActiveModal,
    private alertService: AlertService,
    private adminService: AdminService,
    private tokenStorageService:TokenStorageService,
    private userService:UserService,
    private studentService: StudentService,
    private uploadFileService: UploadFileService) { }

  ngOnInit(): void {
    this.setUserProfile();

  }

  setUserProfile() {
    if (this.user.Role === Role.Admin) {
      this.adminService.getAdminById(this.user.UserName).subscribe(result => {
        if (result) {
          this.userProfile = result;
          this.isAdmin = true;
        }
      });
    }
    else {
      this.studentService.getStudentById(this.user.UserName).subscribe(result => {
        if (result) {
          this.userProfile = result;
          this.isStudent = true;
        }

      });
    }
  }
  changePassword() {
    this.showPasswordField = !this.showPasswordField;
  }
  confirmNewPWD() {
    if (this.newPWD === this.confirmPWD && this.newPWD.length >= 5)
    {
      this.isConfirmed=true;
    }
    else if(this.newPWD !== this.confirmPWD && this.newPWD.length >= 5 && this.newPWD.length !== 0)
      this.isConfirmed=false;   
  }

  checkCurrentPWD()
  {
    if(this.currentPWD.length > 0)
    {
    this.userService.checkEnteredPWD(this.currentPWD,this.userProfile.Id).subscribe(res=>{
      if(res)
        this.isCurrent=true;
    },
    err=>{
      this.isCurrent=false;
    }
    )
  }
  }


  public uploadFile = (files: any) => {
    if (files.length === 0) {
      return;
    }
    let fileToUpload = <File>files[0];
    const formData = new FormData();
    formData.append('file', fileToUpload, fileToUpload.name);
    this.uploadFileService.uploadImage(formData).pipe(first())
      .subscribe(result => {
        if (result)
          this.userProfile.Image = Object.values(result).toString();
      });
  }
  public createImgPath = (serverPath: string) => {
    return `https://localhost:5001/${serverPath}`;
  }

  onSubmit() {
  
    if (this.isAdmin) {
      this.adminService.update(this.userProfile).subscribe(result => {
        if(result)
        {
         const user = this.tokenStorageService.getUser();
         user.Email=this.userProfile.Email;
         this.tokenStorageService.saveUser(user);
          if(this.showPasswordField)
          
            this.updateUser(); 
            else
            {
                 this.alertService.successResponseFromDataBase();
                 this.activeModal.close();
            }
        } 
      });
    }
    else if(this.isStudent)
  {
      this.studentService.update(this.userProfile).subscribe(result => {
        if(result)
        {
          const user = this.tokenStorageService.getUser();
         user.Email=this.userProfile.Email;
         this.tokenStorageService.saveUser(user);
          if(this.showPasswordField)
               this.updateUser(); 
          else
          {
               this.alertService.successResponseFromDataBase();
               this.activeModal.close();
          }
        } 
      });
    }
   
  
  }
  checkNewPWD()
  {
   if(this.newPWD.match("^[A-Za-z0-9]+$"))
    this.isCorrectFormat=true;
   else
    this.isCorrectFormat=false;
    if(this.newPWD !== this.currentPWD)
    this.isSame=true;
   else
    this.isSame=false;

  }
  updateUser()
  {
    if(this.isConfirmed && this.newPWD.length >= 5 && this.confirmPWD === this.newPWD && this.isCorrectFormat)
    {
    this.user.Password=this.newPWD; 
    var today=new Date();
    today.setFullYear(today.getFullYear()+1);
    this.user.Email=this.userProfile.Email;
    this.user.ChangePwdDate=today.toLocaleDateString();
    this.userService.updateUser(this.user).subscribe(res=>{
      if(res)
      {
      this.tokenStorageService.saveUser(this.user);  
      this.alertService.successResponseFromDataBase();
      this.activeModal.close();
      }
    })
    
    
  }
  else
    this.alertService.errorFormField();
}
}
