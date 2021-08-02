import { Component, OnInit } from '@angular/core';
import { dark } from 'src/app/shared/helperServices/themeProperties';
import { ThemeService } from '../../../shared/helperServices/theme.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  isDarkMode=false;
  constructor(private themeService: ThemeService) { }

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

}
