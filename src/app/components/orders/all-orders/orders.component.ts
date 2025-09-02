import { Component, OnInit } from '@angular/core';
import { Order } from '../../../core/models/order/order.model';
import { UserModel } from '../../../core/models/user/user.model';
import { OrderService } from '../../../core/services/order/order.service';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import { TitleCasePipe } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-orders',
  imports: [MatCardModule,MatButtonModule,TitleCasePipe],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss'
})
export class OrdersComponent implements OnInit{
  
  public currentUser : UserModel
  public currentUserId : number
  public currentUserOrders : Order[]

  constructor(private orderService : OrderService,private router : Router){}

  ngOnInit(): void {
    let allOrders = this.orderService.getAllOrders()
    this.currentUser = JSON.parse(localStorage.getItem('userLoggedIn'))
    this.currentUserId = this.currentUser.id
    this.currentUserOrders = allOrders.filter((p)=> p.userId === this.currentUserId)
  }

  public onClick(id : number){
    this.router.navigate([`/orders/detail/${id}`])
  }

  public toBuy(){
    this.router.navigate(['/shoelist'])
  }

}
