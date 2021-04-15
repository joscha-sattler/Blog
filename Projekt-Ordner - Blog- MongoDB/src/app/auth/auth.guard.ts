
// um zu regeln, ob bestimmte url's geladen werden dürfen oder nicht 
// --> nicht eingeloggte user sollten z.B. nicht über die URL das einloggen umgehen können

import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';


@Injectable()
export class AuthGuard implements CanActivate {
    
    
    constructor(private authService: AuthService, private router: Router) {}

    canActivate(                                                                            //return true = Url zugägnlich, flase = Url nicht zugänglich
        route: ActivatedRouteSnapshot,  
        state: RouterStateSnapshot): boolean | import("@angular/router").UrlTree
        | import("rxjs").Observable<boolean | import("@angular/router").UrlTree> 
        | Promise<boolean | import("@angular/router").UrlTree> {
            
            const isAuth = this.authService.getIsAuthenticated();   // wir setzen true / false abhängig, ob der User Authentifiziert ist über den AuthService
           
            if (!isAuth) {
                this.router.navigate(['/login'])
            }

            return isAuth;
    }


}