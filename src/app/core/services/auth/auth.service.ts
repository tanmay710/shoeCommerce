import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { UserModel } from '../../models/user/user.model';
import { CartService } from '../cart/cart.service';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isLoggedIn = new BehaviorSubject<boolean>(false)
  public isLoggedIn$ = this.isLoggedIn.asObservable()

  constructor(private cartService : CartService) {
    const user = localStorage.getItem('userLoggedIn')
    if(user){
      this.isLoggedIn.next(true)
    }
  }
  
  public login(user : UserModel){
    localStorage.setItem('userLoggedIn',JSON.stringify(user))
    this.cartService.loginCartSize()
    this.isLoggedIn.next(true)
  }

  public logout(){
    localStorage.removeItem('userLoggedIn')
    this.cartService.logoutCartSize()
    this.isLoggedIn.next(false)
  }

}
