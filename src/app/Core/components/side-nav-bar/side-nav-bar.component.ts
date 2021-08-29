import { Component, OnInit, OnDestroy } from '@angular/core';
import { Admin } from 'src/services/models/admin';
import { LoggedUser } from 'src/services/models/loggedUser';
import { AdminService } from 'src/services/WebApiService/admin.service';
import { StudentService } from '../../../../services/WebApiService/student.service';
import { RequestService } from '../../../../services/WebApiService/request.service';
import { Subscription, timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Request } from 'src/services/models/request';
import { TokenStorageService } from '../../../shared/helperServices/token-storage.service';
import { Role } from 'src/app/shared/pipes-and-enum/roleEnum';

@Component({
  selector: 'app-side-nav-bar',
  templateUrl: './side-nav-bar.component.html',
  styleUrls: ['./side-nav-bar.component.scss']
})
export class SideNavBarComponent implements OnInit, OnDestroy {

  public isAdmin = false;
  public isStudent = false;
  public loggedUser: LoggedUser;
  newRequest = 0;
  requestListSubscription!: Subscription;
  constructor(private adminService: AdminService, private studentService: StudentService, private requestService: RequestService, private tokenStorage: TokenStorageService) { }

  ngOnInit(): void {
    this.getCountOfNewRequest();
    this.setLoggedUserDetails();
  }

  setLoggedUserDetails() {
    const sessionUser = this.tokenStorage.getUser();
    this.loggedUser = {
      Id: sessionUser.UserName,
      Role: sessionUser.Role
    }
    if (this.loggedUser.Role === Role.Admin) {
      this.isAdminLogged();
    }
    else if (this.loggedUser.Role === Role.Student)
      this.isStudentLogged();
  }

  isAdminLogged() {
   
        var admin=JSON.parse(this.tokenStorage.getToken('personal_info'));
        this.setPersonalInfo(admin);
        this.isAdmin = true;  
  }

  isStudentLogged() {
        var student=JSON.parse(this.tokenStorage.getToken('personal_info'));
        this.setPersonalInfo(student);
       // this.tokenStorage.saveToken('group', result.Group_Id);
        this.isStudent = true;
      
  }

  setPersonalInfo(user:any)
  {
    const role=this.tokenStorage.getToken('role');
    this.loggedUser = {
      First_name: user.First_name,
      Last_name: user.Last_name,
      Image: user.Image,
      Role: role
    }
  }
  public createImgPath = (serverPath: string) => {
    return `https://localhost:5001/${serverPath}`;
  }

  getCountOfNewRequest() {
    this.requestListSubscription = timer(0, 60000).pipe(
      switchMap(() => this.requestService.getCountOfNewRequest("New"))
    ).subscribe((count: number) => {
      this.newRequest = count;
    });
  }

  ngOnDestroy() {
    if (this.requestListSubscription)
      this.requestListSubscription.unsubscribe();
  }

}
