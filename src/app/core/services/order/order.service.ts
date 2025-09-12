import { Injectable } from '@angular/core';
import { Order } from '../../models/order/order.model';
import { UserService } from '../user/user.service';
import { UserModel } from '../../models/user/user.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {


  constructor(private userService : UserService) { }

  public getAllOrders(){
    let allOrder : Order[] = JSON.parse(localStorage.getItem('order')) || []
    return allOrder
  }

  public getCurrentUserOrders(){
    let allOrder: Order[] = this.getAllOrders()
    let user : UserModel = this.userService.getCurrentUser()
    let userOrders : Order[] = allOrder.filter((order)=> order.userId === user.id)
    return userOrders
  }

  public addOrder(order : Order){
    let orders = this.getAllOrders()
    orders.push(order)
    localStorage.setItem('order',JSON.stringify(orders))
  }
}
