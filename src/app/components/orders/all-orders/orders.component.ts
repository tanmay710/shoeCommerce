import { Component, OnInit } from '@angular/core';
import { Order } from '../../../core/models/order/order.model';
import { UserModel } from '../../../core/models/user/user.model';
import { OrderService } from '../../../core/services/order/order.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { TitleCasePipe } from '@angular/common';
import { Router } from '@angular/router';
import { UserService } from '../../../core/services/user/user.service';
import { OrderShow } from '../../../core/models/order/order.show.model';
import { CartShowModel } from '../../../core/models/cart/cart.show.model';
import { ProductCategory } from '../../../core/models/product-category/product.category.model';
import { ProductModel } from '../../../core/models/product/product.model';
import { ProductService } from '../../../core/services/product/product.service';
import { CategoriesService } from '../../../core/services/categories/categories.service';

@Component({
  selector: 'app-orders',
  imports: [MatCardModule, MatButtonModule, TitleCasePipe],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss'
})
export class OrdersComponent implements OnInit {

  public currentUser: UserModel
  public currentUserId: number
  public currentUserOrders: Order[]
  public showOrders: OrderShow[]
  public categories: ProductCategory[]

  constructor(private orderService: OrderService, private router: Router,
    private userService: UserService,
    private productService: ProductService,
    private categoryService: CategoriesService
  ) { }

  ngOnInit(): void {
    let allOrders = this.orderService.getAllOrders()
    this.currentUser = this.userService.getCurrentUser()
    this.categories = this.categoryService.getCategories()
    this.currentUserId = this.currentUser.id
    this.currentUserOrders = allOrders.filter((p) => p.userId === this.currentUserId)
    this.showOrders = this.currentUserOrders.map((p) => {
      let showCart: CartShowModel = {
        userId: 0,
        items: [],
        totalAmount: 0
      }
      showCart.totalAmount = p.cart.totalAmount
      showCart.userId = p.cart.userId
      showCart.items = p.cart.items.map((c) => {
        let prod: ProductModel[] = this.productService.getShoes()
        let prod1: ProductModel = prod.find((exprod) => exprod.id === c.productId)
        let category: ProductCategory = this.categories.find((c) => c.id === prod1.categoryId)
        return {
          productId: c.productId,
          gst: category.gst,
          productName: prod1.name,
          cost: prod1.cost,
          quantity: c.quantity,
          totalcost: c.totalcost
        }
      })
      return {
        orderId: p.orderId,
        userId: p.userId,
        cart: showCart,
        orderDate: p.orderDate
      }
    })
  }

  public onClick(id: number) {
    this.router.navigate([`/orders/detail/${id}`])
  }

  public toBuy() {
    this.router.navigate(['/shoelist'])
  }

}
