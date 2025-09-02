import { Injectable } from '@angular/core';
import { Order } from '../../models/order/order.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor() { }

  public getAllOrders(){
    let allOrder : Order[] = JSON.parse(localStorage.getItem('order')) || []
    return allOrder
  }

  public addOrder(order : Order){
    let orders = this.getAllOrders()
    orders.push(order)
    localStorage.setItem('order',JSON.stringify(orders))
  }
}
