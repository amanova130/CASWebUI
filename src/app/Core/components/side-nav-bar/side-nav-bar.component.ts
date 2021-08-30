import { Component, OnInit, OnDestroy } from '@angular/core';
import { LoggedUser } from 'src/services/models/loggedUser';
import { RequestService } from '../../../../services/WebApiService/request.service';
import { Subscription, timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';
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
  constructor(private requestService: RequestService, private tokenStorage: TokenStorageService) { }

  ngOnInit(): void {
    this.getCountOfNewRequest();
    this.setLoggedUserDetails();
  }

  // Set logged User Details to session storage
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

    var admin = JSON.parse(this.tokenStorage.getToken('personal_info'));
    this.setPersonalInfo(admin);
    this.isAdmin = true;
  }

  isStudentLogged() {
    var student = JSON.parse(this.tokenStorage.getToken('personal_info'));
    this.setPersonalInfo(student);
    this.isStudent = true;

  }
  // Get logged user details from session storage
  setPersonalInfo(user: any) {
    const role = this.tokenStorage.getToken('role');
    this.loggedUser = {
      First_name: user.First_name,
      Last_name: user.Last_name,
      Image: user.Image,
      Role: role
    }
  }

  // Create Image path
  public createImgPath = (serverPath: string) => {
    return `https://localhost:5001/${serverPath}`;
  }
  // Set count of request
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
