import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { dark } from 'src/app/shared/helperServices/themeProperties';
import { ThemeService } from '../../../shared/helperServices/theme.service';
import { TokenStorageService } from '../../../shared/helperServices/token-storage.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  isDarkMode=false;
  constructor(private themeService: ThemeService, private tokenStorage: TokenStorageService, private router: Router,) { }

  ngOnInit(): void {
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

  logOut(){
    this.tokenStorage.signOut();
    this.router.navigate(['/login']); 
  }

}
