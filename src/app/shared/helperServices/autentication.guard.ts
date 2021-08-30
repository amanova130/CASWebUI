// Routing and Autentication Guard
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { TokenStorageService } from './token-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AutenticationGuard implements CanActivate {
  constructor(private router: Router, private tokenStorage: TokenStorageService) { }

  // Routing Guard, if user authotization failed will redirect to login page, otherwise will redirect to page by user role
  canActivate(route: ActivatedRouteSnapshot,
    _state: RouterStateSnapshot): boolean {
    const isLogged = this.tokenStorage.isUserLogged();
    let userRole = this.tokenStorage.getToken('role');
    if (isLogged) {
      if (route.data.roles && route.data.roles.indexOf(userRole) === -1) {
        // role not authorised so redirect to login page
        this.router.navigateByUrl("/login");
        return false;
      }
      return true;
    }

    // not logged in so redirect to login page with the return url
    this.router.navigateByUrl("/login");
    return false;
  }
}
