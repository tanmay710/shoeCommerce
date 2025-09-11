import { Component, OnInit } from '@angular/core';
import { UserService } from '../../core/services/user/user.service';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { FormGroup, FormBuilder } from '@angular/forms';
import { UserModel } from '../../core/models/user/user.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';
import { SnackbarService } from '../../shared/services/snackbar/snackbar.service';

@Component({
  selector: 'app-signup',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, RouterLink],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent implements OnInit{

  public signupForm : FormGroup
  public users : UserModel[]
  public isSubmit : boolean = false
  constructor(private userService : UserService,private fb :FormBuilder,private router : Router,private snackbar : SnackbarService){
    this.signupForm = this.fb.group({
      name : ['',Validators.required],
      email : ['',[Validators.required,Validators.email]],
      phone : ['',[Validators.required,Validators.minLength(10),Validators.maxLength(10)]],
      password : ['',[Validators.required,Validators.minLength(6)]]
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
        this.snackbar.showSnackbar("Successfully signed up",'Success')
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
        this.snackbar.showSnackbar("Successfully signed up",'Success')
      }
      this.router.navigate(['/login'])
    }
  }
}
