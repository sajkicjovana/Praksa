import { CanActivateFn } from '@angular/router';
import { Router, RouterLink } from "@angular/router";
import { AuthService } from '../services/auth.services';
import { inject } from '@angular/core';


export const authGuard: CanActivateFn = (route, state) => {
  const api: AuthService = inject(AuthService);
  
  const router = inject(Router);

  if(localStorage.getItem("token") == null)
    // return false;
      return router.navigate(["login"]);

  return true;
};
