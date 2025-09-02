import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService =   inject(AuthService);
  const router = inject(Router)
  let isLoggedIn : boolean = false
  authService.isLoggedIn$.subscribe((status)=>{
    isLoggedIn = status
  })
  if(isLoggedIn){
    return true
  }
  else{
    router.navigate(['/login'])
    return false
  }
};
