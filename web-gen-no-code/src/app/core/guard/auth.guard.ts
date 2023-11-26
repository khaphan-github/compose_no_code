import { Injectable, inject } from "@angular/core";
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivateFn, Router } from "@angular/router";
import { AppService } from "src/app/app.service";

@Injectable({ providedIn: 'root' })
class AuthGuard {
  private appService = inject(AppService);
  private route = inject(Router);

  constructor() { }
  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    Promise<boolean | UrlTree> {
    if (this.appService.isValidSecretKey()) {
      return true;
    }
    this.route.navigate(['login']);
    return false;
  }
}

export const CanActivateAuthGuard: CanActivateFn =
  (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    return inject(AuthGuard).canActivate(route, state);
  }
