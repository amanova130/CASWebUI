import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { dark } from 'src/app/shared/helperServices/themeProperties';
import { User } from 'src/services/models/user';
import { ThemeService } from '../../../shared/helperServices/theme.service';
import { TokenStorageService } from '../../../shared/helperServices/token-storage.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProfileComponent } from '../../../shared/components/profile/profile.component';
import { AlertService } from '../../../shared/helperServices/alert.service';
import { UserService } from 'src/services/WebApiService/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  loggedUser: User;
  isDarkMode=false;
  constructor(private themeService: ThemeService, private tokenStorage: TokenStorageService, private router: Router,
    private modalRef: NgbModal,
    private userService:UserService,
    private alertService: AlertService) { }

  ngOnInit(): void {
    this.loggedUser = this.tokenStorage.getUser();
    let storedTheme = localStorage.getItem('theme');
    let checkValue = localStorage.getItem('checkbox');
    if (storedTheme == 'dark' && checkValue == 'true') {
      this.themeService.setActiveTheme(dark);
      this.isDarkMode = true;
    }
  }

  toggleTheme() {
    if (this.themeService.isDarkTheme()) {
      this.themeService.setLightTheme();
    } else {
      this.themeService.setDarkTheme();
    }
  }

  openProfileModal(){
    const ref = this.modalRef.open(ProfileComponent);
    ref.componentInstance.user = this.loggedUser;
  }

  logOut(){
    const user:User=this.tokenStorage.getUser();
    user.LogOff=new Date();
    this.userService.updateUser(user).subscribe(res=>{
      if(res)
      {
        this.tokenStorage.signOut();
        this.router.navigate(['/login']); 
      }
    })
  }

}
