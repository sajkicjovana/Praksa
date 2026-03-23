import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.services';
import { inject } from '@angular/core';

export const noAuthGuard: CanActivateFn = (route, state) => {
  // const api: AuthService = inject(AuthService)
    const router = inject(Router);
  if(localStorage.getItem("token") != null)
    return router.navigate(["/connections"]);
    // return false;

  return true;
};
