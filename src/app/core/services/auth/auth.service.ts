import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { UserModel } from '../../models/user/user.model';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isLoggedIn = new BehaviorSubject<boolean>(false)
  isLoggedIn$ = this.isLoggedIn.asObservable()

  constructor() {
    const user = localStorage.getItem('userLoggedIn')
    if(user){
      this.isLoggedIn.next(true)
    }
  }
  
  public login(user : UserModel){
    localStorage.setItem('userLoggedIn',JSON.stringify(user))
    this.isLoggedIn.next(true)
  }

  public logout(){
    localStorage.removeItem('userLoggedIn')
    this.isLoggedIn.next(false)
  }

}
