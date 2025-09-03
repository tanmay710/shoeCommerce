import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { take,map } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const authService =   inject(AuthService);
  const router = inject(Router)
  return authService.isLoggedIn$.pipe(
    take(1),
    map((isLoggedIn)=>{
      if(isLoggedIn){
        return true
      }
      else{
        return router.createUrlTree(['/login'])
      }
    })
  )
  
};
