import { Component, OnInit } from '@angular/core';
import { UserService } from '../../core/services/user/user.service';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { FormGroup, FormBuilder } from '@angular/forms';
import { UserModel } from '../../core/models/user/user.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  imports: [ReactiveFormsModule,MatFormFieldModule, MatInputModule, MatSelectModule,MatButtonModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent implements OnInit{

  public signupForm : FormGroup
  public users : UserModel[]

  constructor(private userService : UserService,private fb :FormBuilder,private router : Router){
    this.signupForm = this.fb.group({
      name : ['',Validators.required],
      email : ['',Validators.required],
      phone : ['',Validators.required],
      password : ['',Validators.required]
    })
  }

  ngOnInit(): void {
    this.userService.getUsers().subscribe((data)=>{
      this.users = data
    })
  }

  onSubmit(){
    if(this.signupForm.valid){

      if(this.users.length !==0){
        const lastUser = this.users[this.users.length -1]
        console.log(lastUser);
        
        const newUser : UserModel ={
          id: lastUser.id +1,
          name: this.signupForm.value.name,
          email: this.signupForm.value.email,
          phone: this.signupForm.value.phone,
          password: this.signupForm.value.password
        }
        this.userService.addUser(newUser)
      }
      else{
        const newUser : UserModel = {
          id: 1,
          name: this.signupForm.value.name,
          email: this.signupForm.value.email,
          phone: this.signupForm.value.phone,
          password: this.signupForm.value.password
        }
        this.userService.addUser(newUser)
      }
      this.router.navigate(['/login'])
    }
  }
}
