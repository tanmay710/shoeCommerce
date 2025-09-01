import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { UserService } from '../../core/services/user/user.service';
import { UserModel } from '../../core/models/user/user.model';
 import { Router } from '@angular/router';
 import { MatButtonModule } from '@angular/material/button';
import { ProductService } from '../../core/services/product/product.service';
import { AuthService } from '../../core/services/auth/auth.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatSelectModule,MatButtonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit{
  public loginForm : FormGroup
  public users : UserModel[]

  constructor(private userService : UserService,private fb : FormBuilder, private router : Router,
    private productService : ProductService,private authService : AuthService){
    this.loginForm = this.fb.group({
      email : ['',Validators.required],
      password : ['',Validators.required]
    })
    
  }

  ngOnInit(): void {
    this.userService.getUsers().subscribe((data)=>{
      this.users = data
    })  
    // this.productService.storeDetails()
  }

  public onSubmit(){
    if(this.loginForm.valid){
      const user = this.users.find((p)=> (p.email === this.loginForm.value.email) && (p.password === this.loginForm.value.password))
      if(user){
        alert("successfully logged in")
        this.authService.login(user)
        this.router.navigate(['/shoelist'])
      } 
      else{
        alert("Credentials do not match")
        this.loginForm.reset()
      }
    }
  }

  public onClick(){
    this.router.navigate(['/signup'])
  }
}
