import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from '../../../core/services/order/order.service';
import { Order } from '../../../core/models/order/order.model';
import { TitleCasePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-order-details',
  imports: [MatCardModule,MatButtonModule,TitleCasePipe],
  templateUrl: './order-details.component.html',
  styleUrl: './order-details.component.scss'
})
export class OrderDetailsComponent implements OnInit{

  public order : Order
  public orderId : number
  constructor(private route : ActivatedRoute,private orderService : OrderService,private router : Router){}

  ngOnInit(): void {
    this.orderId = +this.route.snapshot.paramMap.get('id')
    let allOrders  = this.orderService.getAllOrders()
    this.order = allOrders.find((p)=> p.orderId === this.orderId)
  }
  
  public onClick(id : number){
    this.router.navigate([`/shoe-details/${id}`])
  }
} 
