import { Component, OnInit } from '@angular/core';
import { Cart } from '../../core/models/cart/cart.model';
import { CartService } from '../../core/services/cart/cart.service';
import { UserModel } from '../../core/models/user/user.model';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CartItem } from '../../core/models/cart/cart.item.model';
import { MatButtonModule } from '@angular/material/button';
import { TitleCasePipe } from '@angular/common';
import { Order } from '../../core/models/order/order.model';
import { OrderService } from '../../core/services/order/order.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkout',
  imports: [MatTableModule,MatButtonModule,TitleCasePipe],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent implements OnInit{
  public userCart : Cart
  public user : UserModel
  public currentUser : UserModel
  public dataSource : MatTableDataSource<CartItem>
  public displayedColumns: string[] = ['name', 'cost', 'quantity']
  constructor(private cartService : CartService,private orderService : OrderService,private router : Router){}
  ngOnInit(): void {
    this.userCart = this.cartService.getCart()
    this.dataSource = new MatTableDataSource(this.userCart?.items)  
    this.user = JSON.parse(localStorage.getItem('userLoggedIn'))
  }
  
  public onConfirm(){
    const confirmation = confirm("Do you confirm your order")
    if(confirmation){
      let allOrders = this.orderService.getAllOrders()
      let lastOrder = allOrders[allOrders.length -1]
      let lastOrderIndex : number
      let orderDate = new Date()
      if(lastOrder){
        lastOrderIndex = lastOrder.orderId
      }
      else{
        lastOrderIndex = 0
      }
      let order : Order = {
        userId: this.user.id,
        cart: this.userCart,
        orderId: lastOrderIndex + 1,
        orderDate: orderDate.toLocaleString()
      }
      this.orderService.addOrder(order)
      this.cartService.removeCart()
      this.router.navigate(['/orders'])
    }
  }

  public onClick(){
    this.router.navigate(['/shoelist'])
  }
}
