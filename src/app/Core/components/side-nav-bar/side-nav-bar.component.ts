import { Component, OnInit } from '@angular/core';
import { Admin } from 'src/services/models/admin';
import { LoggedUser } from 'src/services/models/loggedUser';
import { AdminService } from 'src/services/WebApiService/admin.service';
import { StudentService } from '../../../../services/WebApiService/student.service';

@Component({
  selector: 'app-side-nav-bar',
  templateUrl: './side-nav-bar.component.html',
  styleUrls: ['./side-nav-bar.component.scss']
})
export class SideNavBarComponent implements OnInit {

  public isAdmin= false;
  public isStudent= false;
  public loggedUser: LoggedUser;
  constructor(private adminService: AdminService, private studentService: StudentService) { }

  ngOnInit(): void {
    this.loggedUser={
      Id: localStorage.getItem('userId'),
      Role: localStorage.getItem('userRole'),
    }
    if(this.loggedUser.Role === 'Admin')
    {
      this.isAdminLogged();
    }
    else if(this.loggedUser.Role === 'Student')
      this.isStudentLogged();
  }

  isAdminLogged(){
    this.adminService.getAdminById(this.loggedUser.Id).subscribe( result=>
      {
        if(result)
        {
          this.loggedUser = {
            First_name: result.First_name,
            Last_name: result.Last_name,
            Email: result.Email,
            Phone: result.Phone,
            Image: result.Image,
            Birth_date: result.Birth_date,
            Id: localStorage.getItem('userId'),
            Role: localStorage.getItem('userRole'),
          }
          this.isAdmin = true;
        }
      });
  }

  isStudentLogged(){
    this.studentService.getStudentById(this.loggedUser.Id).subscribe( result=>
      {
        if(result)
        {
          this.loggedUser = {
            First_name: result.First_name,
            Last_name: result.Last_name,
            Email: result.Email,
            Phone: result.Phone,
            Image: result.Image,
            Birth_date: result.Birth_date,
            Id: localStorage.getItem('userId'),
            Role: localStorage.getItem('userRole'),
          }
          localStorage.setItem('group', result.Group_Id);
          this.isStudent = true;
        }
      });
  }
  public createImgPath = (serverPath: string) => {
    return `https://localhost:5001/${serverPath}`;
  }


}
