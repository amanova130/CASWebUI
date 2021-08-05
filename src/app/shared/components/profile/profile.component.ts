import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AdminService } from 'src/services/WebApiService/admin.service';
import { AlertService } from '../../helperServices/alert.service';
import { StudentService } from '../../../../services/WebApiService/student.service';
import { User } from 'src/services/models/user';
import { Admin } from '../../../../services/models/admin';
import { Role } from '../../pipes-and-enum/roleEnum';
import { UploadFileService } from '../../../../services/WebApiService/uploadFile.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  @Input() public user: User;
  userProfile: any;
  isLoading = false;
  showPasswordField = false;
  newPWD: string;
  confirmPWD: string;
  currentPWD: string;
  icon: string;
  isStudent = false;
  isAdmin = false;

  constructor(public activeModal: NgbActiveModal,
    private alertService: AlertService,
    private adminService: AdminService,
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
    if (this.newPWD === this.confirmPWD)
      this.icon = "check_circle";
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
          this.alertService.successResponseFromDataBase();
          this.activeModal.close();
        } 
      });
    }
    else if(this.isStudent)
    {
      this.studentService.update(this.userProfile).subscribe(result => {
        if(result)
        {
          this.alertService.successResponseFromDataBase();
          this.activeModal.close();
        } 
      });
    }
  }

}
