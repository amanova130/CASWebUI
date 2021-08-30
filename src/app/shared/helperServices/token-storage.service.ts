// Token Storage Service - respnsible to save the neede data in LocalStorage or Session Storage
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {
  constructor() { }

  signOut(): void {
    window.sessionStorage.clear();
  }

  public saveToken(key: string, value: string): void {
    window.sessionStorage.removeItem(key);
    window.sessionStorage.setItem(key, value);
  }

  public getToken(key: string): string | null {
    return window.sessionStorage.getItem(key);
  }

  public saveUser(user: any): void {
    window.sessionStorage.removeItem('user');
    window.sessionStorage.setItem('user', JSON.stringify(user));
  }

  public getUser(): any {
    const user = window.sessionStorage.getItem('user');
    if (user) {
      return JSON.parse(user);
    }
    return {};
  }

  public isUserLogged(): boolean {
    if (window.sessionStorage.getItem('user'))
      return true;
    return false;
  }
}
