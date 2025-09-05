import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth/auth.service';
import { CartService } from '../../../core/services/cart/cart.service';
import { Cart } from '../../../core/models/cart/cart.model';

@Component({
  selector: 'app-header',
  imports: [MatToolbarModule, MatButtonModule, MatIconModule,RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit{
  public isLoggedIn : boolean = false
  cartSize : number
  constructor(private authService : AuthService,private router : Router,private cartService : CartService){}
  ngOnInit(): void {
    this.authService.isLoggedIn$.subscribe((status)=>{
      this.isLoggedIn = status
    })
    this.cartService.cartSize$.subscribe((size)=>{
      this.cartSize = size
    })
  }

  public onLogout(){
    const confirmation = confirm("Are you sure you want to logout")
    if(confirmation){
      this.authService.logout()
      this.router.navigate(['/login'])
    }
    
  }
}
