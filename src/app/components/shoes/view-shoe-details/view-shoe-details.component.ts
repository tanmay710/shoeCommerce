import { Component, OnInit } from '@angular/core';
import { ShoeModel } from '../../../core/models/product/product.model';
import { ProductService } from '../../../core/services/product/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe, NgOptimizedImage, TitleCasePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from '@angular/material/input';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { CartItem } from '../../../core/models/cart/cart.item.model';
import { Cart } from '../../../core/models/cart/cart.model';
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
@Component({
  selector: 'app-view-shoe-details',
  imports: [TitleCasePipe, MatButtonModule,
    MatFormFieldModule, MatInputModule, FormsModule,
    ReactiveFormsModule, MatCardModule, MatTabsModule, DatePipe,
    MatIconModule,NgxStarsModule],
  templateUrl: './view-shoe-details.component.html',
  styleUrl: './view-shoe-details.component.scss'
})
export class ViewShoeDetailsComponent implements OnInit {
  public shoe: ShoeModel
  public shoeId: number
  public clicked: boolean = false
  public quantForm: FormGroup
  public isDisabled: boolean = true
  public submitted: boolean = false
  public categoryShoes: ShoeModel[]
  public categoryId: number
  public shoeReviews: ReviewModel[]
  public userId: number

  constructor(private productService: ProductService, private route: ActivatedRoute,
    private fb: FormBuilder, private cartService: CartService, private router: Router,
    private reviewService: ReviewService, private dialog: MatDialog
  ) {
    this.quantForm = this.fb.group({
      quantity: ['', Validators.required]
    })
  }

  ngOnInit(): void {
    this.shoeId = +this.route.snapshot.paramMap.get('id')
    const shoes: ShoeModel[] = JSON.parse(localStorage.getItem('shoes'))
    this.shoe = shoes.find((p) => p.id === this.shoeId)
    this.categoryId = this.shoe.category.id
    this.categoryShoes = shoes.filter((p) => p.category.id === this.categoryId && p.id !== this.shoeId)
    let allReviews = this.reviewService.getAllReviews()
    let thisShoeReviews = allReviews.filter((p) => p.productId === this.shoeId)
    this.shoeReviews = thisShoeReviews
    let currUser: UserModel = JSON.parse(localStorage.getItem('userLoggedIn'))
    this.userId = currUser.id
  }

  public addToCart() {
    if (this.shoe.inventory !== 0) {
      this.clicked = true
    }
    else {
      alert("The product is currently out of stock, please select different product")
    }
  }

  public onSubmit() {
    this.submitted = true
    if (this.quantForm.valid) {
      if (this.quantForm.value.quantity <= this.shoe.inventory) {
        let existingCart: Cart = JSON.parse(localStorage.getItem('cart'))
        let ifProductInCart: boolean = false

        if (existingCart) {
          let prod: CartItem = existingCart.items.find((p) => p.productId === this.shoeId)
          if (prod) {
            ifProductInCart = true
            let totQuantity = prod.quantity + this.quantForm.value.quantity
            if (totQuantity > this.shoe.inventory) {
              alert(`Not enough quantity in inventory, max you can buy is ${this.shoe.inventory}`)
            }
            else {
              prod.quantity = totQuantity
            }
            this.cartService.updateCartItem(prod)
          }
          else {
            let cartItem: CartItem = {
              productId: this.shoeId,
              name: this.shoe.name,
              cost: this.shoe.cost,
              quantity: this.quantForm.value.quantity
            }
            let newCart: Cart = {
              userId: 0,
              items: [],
              totalAmount: 0
            }
            let user = JSON.parse(localStorage.getItem('userLoggedIn'))
            newCart.userId = user.id
            newCart.items.push(cartItem)
            newCart.totalAmount = newCart.items.reduce((sum, item) => sum + (item.cost * item.quantity), 0)
            this.cartService.addCartItem(newCart, cartItem)
          }
        }
        else {
          let cartItem: CartItem = {
            productId: this.shoeId,
            name: this.shoe.name,
            cost: this.shoe.cost,
            quantity: this.quantForm.value.quantity
          }

          let newCart: Cart = {
            userId: 0,
            items: [],
            totalAmount: 0
          }
          let user = JSON.parse(localStorage.getItem('userLoggedIn'))
          newCart.userId = user.id
          newCart.items.push(cartItem)
          newCart.totalAmount = newCart.items.reduce((sum, item) => sum + (item.cost * item.quantity), 0)
          this.cartService.addCartItem(newCart, cartItem)
        }
        let newShoe: ShoeModel = {
          id: this.shoe.id,
          name: this.shoe.name,
          category: this.shoe.category,
          inventory: this.shoe.inventory - this.quantForm.value.quantity,
          cost: this.shoe.cost,
          img_url: this.shoe.img_url,
          description: this.shoe.description
        }
        this.productService.updateShoe(newShoe)
        alert("successfully added to cart")
        this.router.navigate(['/checkout'])
        this.quantForm.reset()
      }
      else {
        alert(`This much quantity is not in our inventory,max quantity is ${this.shoe.inventory}`)
      }
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
    const dialogref = this.dialog.open(ReviewDialogComponent, { data: { productId: this.shoeId, mode: 'update', existingReview: review } })
    dialogref.afterClosed().subscribe(result => {
      let allReviews = this.reviewService.getAllReviews()
      let thisShoeReviews = allReviews.filter((p) => p.productId === this.shoeId)
      this.shoeReviews = thisShoeReviews
    })

  }

  public onDelete(review: ReviewModel) {
    const confirmation = confirm("Are you sure you want to delete this review")
    if (confirmation) {
      this.reviewService.deleteReview(review)
      let allReviews = this.reviewService.getAllReviews()
      let thisShoeReviews = allReviews.filter((p) => p.productId === this.shoeId)
      this.shoeReviews = thisShoeReviews
    }
  }
}
