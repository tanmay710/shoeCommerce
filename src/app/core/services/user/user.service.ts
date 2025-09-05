import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { UserModel } from '../../models/user/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor() { }

  addUser(user : UserModel){
    this.getUsers().subscribe({next : (data)=>{
      const users = data
      users.push(user)
      localStorage.setItem('users',JSON.stringify(users))
      return user
    }}) 
  }

  getUsers():Observable<UserModel[]>{
    const usersJson =  localStorage.getItem('users')
    const users =  usersJson ? JSON.parse(usersJson) : []
    return of(users)
  }

  getCurrentUser(){
    let currUser : UserModel = JSON.parse(localStorage.getItem('userLoggedIn'))
    return currUser
  }

}
