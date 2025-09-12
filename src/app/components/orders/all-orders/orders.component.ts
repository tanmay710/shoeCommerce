import { Component, OnInit } from '@angular/core';
import { Order } from '../../../core/models/order/order.model';
import { UserModel } from '../../../core/models/user/user.model';
import { OrderService } from '../../../core/services/order/order.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { DatePipe, TitleCasePipe } from '@angular/common';
import { Router } from '@angular/router';
import { UserService } from '../../../core/services/user/user.service';
import { OrderShow } from '../../../core/models/order/order.show.model';
import { ProductCategory } from '../../../core/models/product-category/product.category.model';
import { ProductModel } from '../../../core/models/product/product.model';
import { ProductService } from '../../../core/services/product/product.service';
import { CategoriesService } from '../../../core/services/categories/categories.service';

@Component({
  selector: 'app-orders',
  imports: [MatCardModule, MatButtonModule, TitleCasePipe,DatePipe],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss'
})
export class OrdersComponent implements OnInit {

  public currentUser: UserModel
  public currentUserId: number
  public currentUserOrders: Order[]
  public showOrders: Order[]
  public categories: ProductCategory[]

  constructor(private orderService: OrderService, private router: Router,
    private userService: UserService,
    private productService: ProductService,
    private categoryService: CategoriesService
  ) { }

  ngOnInit(): void {
    this.currentUserOrders = this.orderService.getCurrentUserOrders()
  }

  public onClick(id: number) {
    this.router.navigate([`/orders/detail/${id}`])
  }

  public toBuy() {
    this.router.navigate(['/shoelist'])
  }

}
