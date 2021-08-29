import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AutoResetPassComponent } from 'src/app/shared/components/auto-reset-pass/auto-reset-pass.component';
import { AlertService } from 'src/app/shared/helperServices/alert.service';
import { TokenStorageService } from 'src/app/shared/helperServices/token-storage.service';
import { Role } from 'src/app/shared/pipes-and-enum/roleEnum';
import { User } from 'src/services/models/user';
import { StudentService } from '../../../services/WebApiService/student.service';

@Component({
  selector: 'app-student-page',
  templateUrl: './student-page.component.html',
  styleUrls: ['./student-page.component.scss']
})
export class StudentPageComponent implements OnInit {
loggedUser:User;
role: string = '';
constructor(private modalService: NgbModal,
  private tokenStorage: TokenStorageService,
  private alertService:AlertService,
  private studentService: StudentService) { }

  ngOnInit(): void {
    this.loggedUser=this.tokenStorage.getUser();
    this.role = this.tokenStorage.getToken("role");
   // this.setStudentDetails();
    const today=new Date();
    const dateChange=new Date(new Date(this.loggedUser.ChangePwdDate));
    if(today >= dateChange)
    {
      this.modalService.open(AutoResetPassComponent, { centered: true,backdrop:"static" });
    }   
  }

  // setStudentDetails(){
  //   if(this.role != '' && this.role != Role.Admin)
  //   {
  //     this.studentService.getStudentById(this.loggedUser.UserName).subscribe(res => {
  //       if(res)
  //       {
  //         this.tokenStorage.saveToken("group", res.Group_Id);
  //       }
  //     })
  //   }
  // }
}
