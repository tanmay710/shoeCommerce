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
import { SnackbarService } from '../../shared/services/snackbar/snackbar.service';
import { CategoriesService } from '../../core/services/categories/categories.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  public loginForm: FormGroup
  public users: UserModel[]
  public isSubmit: boolean = false;

  constructor(private userService: UserService, 
    private fb: FormBuilder, 
    private router: Router,
    private productService: ProductService, private authService: AuthService, private snackbar: SnackbarService,
    private categoryService: CategoriesService) {
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    this.userService.getUsers().subscribe((data) => {
      this.users = data
    })
  }

  public onSubmit() {
    this.isSubmit = true
    if (this.loginForm.valid) {
      const user = this.users.find((p) => (p.email === this.loginForm.value.email) && (p.password === this.loginForm.value.password))
      if (user) {

        this.snackbar.showSnackbar('Successfully logged in', 'Success')
        this.authService.login(user)
        this.router.navigate(['/shoelist'])
      }
      else {
        this.snackbar.showSnackbar('Could not authenticate','Error')
        this.loginForm.reset()
      }
    }
  }

  public onClick() {
    this.router.navigate(['/signup'])
  }
}
