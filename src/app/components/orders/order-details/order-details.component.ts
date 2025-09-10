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
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ReviewDialogComponent } from '../../review-dialog/review-dialog.component';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CartItem } from '../../../core/models/cart/cart.item.model';
import { ReviewService } from '../../../core/services/review/review.service';
import { SnackbarService } from '../../../shared/services/snackbar/snackbar.service';
import { CartItemShowModel } from '../../../core/models/cart/cart.item.show.model';
import { UserService } from '../../../core/services/user/user.service';
import { CategoriesService } from '../../../core/services/categories/categories.service';
import { ProductService } from '../../../core/services/product/product.service';
import { ProductCategory } from '../../../core/models/product-category/product.category.model';
import { ProductModel } from '../../../core/models/product/product.model';
@Component({
  selector: 'app-order-details',
  imports: [MatCardModule, MatButtonModule, TitleCasePipe, ReactiveFormsModule, MatTableModule],
  templateUrl: './order-details.component.html',
  styleUrl: './order-details.component.scss'
})
export class OrderDetailsComponent implements OnInit {

  public order: Order
  public orderId: number
  public userId: number
  public reviewform: FormGroup
  public displayedColumns: string[] = ['name', 'priceperpiece', 'quantity', 'totalprice', 'gst', 'gstcost', 'totalcostaftergst', 'review'];
  public OrderDetailsDataSource: MatTableDataSource<CartItemShowModel> = new MatTableDataSource([])
  public showCartData: CartItemShowModel[]
  public categories : ProductCategory[]
  constructor(private route: ActivatedRoute, private orderService: OrderService, private router: Router,
    private fb: FormBuilder, private dialog: MatDialog, private reviewService: ReviewService,
    private userService: UserService,
    private categoryService: CategoriesService,
    private productService: ProductService,
    private snackbar: SnackbarService
  ) {
    this.reviewform = this.fb.group({
      rating: ['', Validators.required],
      comment: ['', Validators.required]
    })
  }

  ngOnInit(): void {
    this.orderId = +this.route.snapshot.paramMap.get('id')
    let allOrders = this.orderService.getAllOrders()
    this.order = allOrders.find((p) => p.orderId === this.orderId)
    let currentUser: UserModel = this.userService.getCurrentUser()
    this.userId = currentUser.id
    this.categories = this.categoryService.getCategories()
    this.showCartData = this.order.cart.items.map((p) => {
      let prod: ProductModel[] = this.productService.getShoes()
      let prod1: ProductModel = prod.find((exprod) => exprod.id === p.productId)
      let category: ProductCategory = this.categories.find((c) => c.id === prod1.categoryId)
      return {
        productId: p.productId,
        gst: category.gst,
        productName: prod1.name,
        cost: prod1.cost,
        quantity: p.quantity,
        totalcost: p.totalcost
      }
    })
    this.OrderDetailsDataSource.data = this.showCartData
  }

  public onClick(id: number) {
    this.router.navigate([`/shoe-details/${id}`])
  }

  public addReview(id: number) {
    let allReviews: ReviewModel[] = this.reviewService.getAllReviews()
    let userProductReview: ReviewModel = allReviews.find((p) => p.userId === this.userId && p.productId === id)
    if (userProductReview) {
      this.snackbar.showError("You have already reviewed this product")
      return
    }
    else {
      this.dialog.open(ReviewDialogComponent, { data: { productId: id, mode: 'add' } })
    }
  }
} 
