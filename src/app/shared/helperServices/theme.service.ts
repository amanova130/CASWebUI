// Theme Service -  toggle to dark or light theme  
import { Injectable } from '@angular/core';
import { Theme, light, dark } from './themeProperties';


@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private active: Theme = light;
  private availableThemes: Theme[] = [light, dark];

  constructor() { }

  getAvailableThemes(): Theme[] {
    return this.availableThemes;
  }

  getActiveTheme(): Theme {
    return this.active;
  }

  isDarkTheme(): boolean {
    return this.active.name === dark.name;
  }

  setDarkTheme(): void {
    this.setActiveTheme(dark);
    localStorage.setItem('theme', 'dark');
    localStorage.setItem('checkbox', 'true');
  }

  setLightTheme(): void {
    this.setActiveTheme(light);
    localStorage.setItem('theme', 'light');
    localStorage.setItem('checkbox', 'false');
  }

  setActiveTheme(theme: Theme): void {
    this.active = theme;

    Object.keys(this.active.properties).forEach(property => {
      document.documentElement.style.setProperty(
        property,
        this.active.properties[property]
      );
    });
  }
}