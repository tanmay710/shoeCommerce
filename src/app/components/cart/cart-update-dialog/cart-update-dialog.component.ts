import { Component, Inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CartService } from '../../../core/services/cart/cart.service';
import { ProductService } from '../../../core/services/product/product.service';
import { SnackbarService } from '../../../shared/services/snackbar/snackbar.service';
import { ProductModel } from '../../../core/models/product/product.model';
import { ProductCategory } from '../../../core/models/product-category/product.category.model';
import { CategoriesService } from '../../../core/services/categories/categories.service';
import { CartItemShowModel } from '../../../core/models/cart/cart.item.model';
import { CartItemStoreModel } from '../../../core/models/cart/cart.item.store.model';
@Component({
  selector: 'app-cart-update-dialog',
  imports: [ReactiveFormsModule, MatButtonModule, MatSelectModule, MatInputModule,
    MatFormFieldModule, FormsModule, MatDialogContent, MatDialogTitle],
  templateUrl: './cart-update-dialog.component.html',
  styleUrl: './cart-update-dialog.component.scss'
})
export class CartUpdateDialogComponent implements OnInit {
  updateForm: FormGroup
  public cartItem: CartItemShowModel
  public categories : ProductCategory[]
  public product: ProductModel

  constructor(private fb: FormBuilder, private cartService: CartService, private snackbar: SnackbarService,
    private productService: ProductService,
    private categoryService : CategoriesService,
    private dialogRef: MatDialogRef<CartUpdateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { cartItem: CartItemShowModel }
  ) {
    this.cartItem = data.cartItem
    this.updateForm = this.fb.group({
      quantity: ['', Validators.required]
    })
  }

  ngOnInit(): void {
    this.updateForm.patchValue(this.cartItem)
    const products: ProductModel[] = this.productService.getShoes()
    this.product = products.find((p) => p.id === this.cartItem.productId)
  }

  public onSubmit() {
    if (this.updateForm.valid) {
      if (this.updateForm.value.quantity <= this.product.inventory) {
        let newCartItem: CartItemStoreModel = { ...this.cartItem }
        newCartItem.quantity = this.updateForm.value.quantity
        this.cartService.updateCartItem(newCartItem)
        this.dialogRef.close()
        this.snackbar.showSnackbar("successfully updated the item",'Success')
      }
      else {
        this.snackbar.showSnackbar(`Not enough quantity in inventory,max(${this.product.inventory})`,'Error')
      }
    }
  }

  public onClose() {
    this.dialogRef.close()
  }

}
