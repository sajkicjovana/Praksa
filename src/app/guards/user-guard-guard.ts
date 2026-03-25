import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const userGuardGuard: CanActivateFn = (route, state) => {
  
  const router = inject(Router);

  if(localStorage.getItem("role") == 'user')
    // return false;
      return router.navigate(["messages"]);

  return true;
};
