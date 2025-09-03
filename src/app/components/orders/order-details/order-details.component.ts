import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from '../../../core/services/order/order.service';
import { Order } from '../../../core/models/order/order.model';
import { TitleCasePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { UserModel } from '../../../core/models/user/user.model';
import { ReviewModel } from '../../../core/models/review/review';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import { ReviewDialogComponent } from '../../review-dialog/review-dialog.component';
import { MatTableModule } from '@angular/material/table';
import { CartItem } from '../../../core/models/cart/cart.item.model';
@Component({
  selector: 'app-order-details',
  imports: [MatCardModule, MatButtonModule, TitleCasePipe, ReactiveFormsModule,MatTableModule],
  templateUrl: './order-details.component.html',
  styleUrl: './order-details.component.scss'
})
export class OrderDetailsComponent implements OnInit {

  public order: Order
  public orderId: number
  public userId: number
  public reviewform: FormGroup
  public displayedColumns: string[] = ['name', 'priceperpiece', 'quantity', 'totalprice','review'];
  public dataSource : CartItem[]
  constructor(private route: ActivatedRoute, private orderService: OrderService, private router: Router,
    private fb: FormBuilder,private dialog : MatDialog
  ) {
    this.reviewform = this.fb.group({
      rating : ['',Validators.required],
      comment : ['',Validators.required]
    })
  }

  ngOnInit(): void {
    this.orderId = +this.route.snapshot.paramMap.get('id')
    let allOrders = this.orderService.getAllOrders()
    this.order = allOrders.find((p) => p.orderId === this.orderId)
    let currentUser: UserModel = JSON.parse(localStorage.getItem('userLoggedIn'))
    this.userId = currentUser.id
    this.dataSource = this.order.cart.items
  }

  public onClick(id: number) {
    this.router.navigate([`/shoe-details/${id}`])
  }

  public addReview(id: number) {
    this.dialog.open(ReviewDialogComponent,{data :{productId : id,mode : 'add'}})
  }
} 
