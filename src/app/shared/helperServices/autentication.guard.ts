import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { TokenStorageService } from './token-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AutenticationGuard implements CanActivate {
  constructor(private router: Router, private tokenStorage: TokenStorageService) {}  

  canActivate(route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean
  {
    const isLogged = this.tokenStorage.isUserLogged();
    let userRole = this.tokenStorage.getToken('role');
    if(isLogged) 
    {
      if (route.data.roles && route.data.roles.indexOf(userRole) === -1) {
        // role not authorised so redirect to home page
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
