import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../core/services/product/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe, NgOptimizedImage, TitleCasePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from '@angular/material/input';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { CartItem } from '../../../core/models/cart/cart.item.model';
import { CartModel } from '../../../core/models/cart/cart.model';
import { CartService } from '../../../core/services/cart/cart.service';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { ReviewModel } from '../../../core/models/review/review';
import { ReviewService } from '../../../core/services/review/review.service';
import { UserModel } from '../../../core/models/user/user.model';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ReviewDialogComponent } from '../../review-dialog/review-dialog.component';
import { NgxStarRatingModule } from 'ngx-star-rating';
import { NgxStarsModule } from 'ngx-stars';
import { SnackbarService } from '../../../shared/services/snackbar/snackbar.service';
import { UserService } from '../../../core/services/user/user.service';
import { ProductModel } from '../../../core/models/product/product.model';
import { ProductCategory } from '../../../core/models/product-category/product.category.model';
import { ProductShowModel } from '../../../core/models/product/product-show.model';
import { CategoriesService } from '../../../core/services/categories/categories.service';
import { ReviewShowModel } from '../../../core/models/review/review-show';
@Component({
  selector: 'app-view-shoe-details',
  imports: [TitleCasePipe, MatButtonModule,
    MatFormFieldModule, MatInputModule, FormsModule,
    ReactiveFormsModule, MatCardModule, MatTabsModule, DatePipe,
    MatIconModule, NgxStarsModule],
  templateUrl: './view-shoe-details.component.html',
  styleUrl: './view-shoe-details.component.scss'
})
export class ViewShoeDetailsComponent implements OnInit {

  public product: ProductModel
  public productShow: ProductShowModel
  public productId: number
  public clicked: boolean = false
  public quantForm: FormGroup
  public isDisabled: boolean = true
  public submitted: boolean = false
  public categoryShoes: ProductModel[]
  public category: ProductCategory
  public categoryId: number
  public productReviews: ReviewShowModel[]
  public userId: number

  constructor(private productService: ProductService, private route: ActivatedRoute,
    private fb: FormBuilder, private cartService: CartService, private router: Router,
    private userService: UserService,
    private categoryService: CategoriesService,
    private reviewService: ReviewService, private dialog: MatDialog, private snackbar: SnackbarService
  ) {
    this.productId = +this.route.snapshot.paramMap.get('id')
    let allShoes: ProductModel[] = productService.getShoes()
    let exShoe: ProductModel = allShoes.find((p) => p.id === this.productId)
    this.quantForm = this.fb.group({
      quantity: ['', [Validators.required, Validators.max(exShoe.inventory), Validators.min(1)]]
    })
  }

  ngOnInit(): void {

    const products: ProductModel[] = this.productService.getShoes()
    this.product = products.find((p) => p.id === this.productId)
    this.categoryId = this.product.categoryId
    let categories: ProductCategory[] = this.categoryService.getCategories()
    this.category = categories.find((p) => p.id === this.product.categoryId)

    this.categoryShoes = products.filter((p) => p.categoryId === this.categoryId && p.id !== this.productId)
    let allReviews = this.reviewService.getAllReviews()
    let productReviews: ReviewModel[] = allReviews.filter((p) => p.productId === this.productId)
    this.productReviews = productReviews.map((p) => {
      let users: UserModel[]
      this.userService.getUsers().subscribe((data) => {
        users = data
      })
      let user: UserModel = users.find((u) => p.userId === u.id)
      return {
        id: p.id,
        rating: p.rating,
        comment: p.comment,
        productId: p.productId,
        userId: p.userId,
        userName: user.name,
        date: p.date
      }
    }
    )
    let currUser: UserModel = this.userService.getCurrentUser()
    this.userId = currUser.id
    this.productShow = {
      id: this.productId,
      name: this.product.name,
      category: this.category,
      inventory: this.product.inventory,
      cost: this.product.cost,
      img_url: this.product.img_url,
      description: this.product.description
    }
  }

  public addToCart() {
    if (this.product.inventory !== 0) {
      this.clicked = true
    }
    else {

      this.snackbar.showError("The product is currently out of stock, please select different product")
    }
  }

  public onSubmit() {
    if (this.quantForm.valid) {
      let userCart: CartModel = this.cartService.getUserCart()
      if (userCart) {
        let prod: CartItem = userCart.items.find((p) => p.productId === this.productId)
        if (prod) {
          let totQuantity = prod.quantity + this.quantForm.value.quantity
          if (totQuantity > this.product.inventory) {
            this.snackbar.showError(`Not enough quantity in inventory, max you can buy is ${this.product.inventory}`)
          }
          else {
            prod.quantity = totQuantity
          }
          this.cartService.updateCartItem(prod)
        }
        else {
          let totCost = (this.product.cost * this.quantForm.value.quantity * (this.category.gst / 100)) + this.product.cost * this.quantForm.value.quantity
          let cartItem: CartItem = {
            productId: this.productId,
            quantity: this.quantForm.value.quantity,
            totalcost: totCost
          }
          let newCart: CartModel = {
            userId: this.userId,
            items: [],
            totalAmount: 0
          }
          newCart.items.push(cartItem)
          newCart.totalAmount = newCart.items.reduce((sum, item) => sum + item.totalcost, 0)
          this.cartService.addCartItem(newCart, cartItem)
        }
      }
      else {
        let totCost = (this.product.cost * this.quantForm.value.quantity * (this.category.gst / 100)) + this.product.cost * this.quantForm.value.quantity
        let cartItem: CartItem = {
          productId: this.productId,
          quantity: this.quantForm.value.quantity,
          totalcost: totCost
        }
        console.log(totCost);
        console.log(this.category.gst);
        console.log((this.product.cost * this.quantForm.value.quantity * (this.category.gst / 100)));

        let newCart: CartModel = {
          userId: this.userId,
          items: [],
          totalAmount: 0
        }
        newCart.items.push(cartItem)
        newCart.totalAmount = totCost
        this.cartService.addCartItem(newCart, cartItem)
      }
      this.snackbar.showSuccess("successfully added to cart")
      this.router.navigate(['/checkout'])
      this.quantForm.reset()
    }
  }

  public toBuy() {
    this.router.navigate(['/shoelist'])
  }

  public onClick(id: number) {
    this.reloadComponent(id)
  }

  public reloadComponent(id: number) {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([`/shoe-details/${id}`])
    })
  }

  public onClose() {
    this.clicked = false
  }

  public onEdit(review: ReviewModel) {
    const dialogref = this.dialog.open(ReviewDialogComponent, { data: { productId: this.productId, mode: 'update', existingReview: review } })
    dialogref.afterClosed().subscribe(result => {
      let allReviews = this.reviewService.getAllReviews()
      let thisShoeReviews = allReviews.filter((p) => p.productId === this.productId)
      this.productReviews = thisShoeReviews.map((p) => {
        let users: UserModel[]
        this.userService.getUsers().subscribe((data) => {
          users = data
        })
        let user: UserModel = users.find((u) => p.userId === u.id)
        return {
          id: p.id,
          rating: p.rating,
          comment: p.comment,
          productId: p.productId,
          userId: p.userId,
          userName: user.name,
          date: p.date
        }
      }
      )
    })

  }

  public onDelete(review: ReviewModel) {
    const confirmation = confirm("Are you sure you want to delete this review")
    if (confirmation) {
      this.reviewService.deleteReview(review)
      let allReviews = this.reviewService.getAllReviews()
      let thisShoeReviews = allReviews.filter((p) => p.productId === this.productId)
      this.productReviews = thisShoeReviews.map((p) => {
      let users : UserModel[]  
      this.userService.getUsers().subscribe((data)=>{
        users = data
      })
      let user : UserModel = users.find((u)=> p.userId === u.id)
      return {
        id: p.id,
        rating: p.rating,
        comment: p.comment,
        productId: p.productId,
        userId: p.userId,
        userName: user.name,
        date: p.date
      }
    }
    )
    }
  }
}
