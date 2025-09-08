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
import { ShoeModel } from '../../../core/models/product/product.model';
import { CartItem } from '../../../core/models/cart/cart.item.model';
import { ProductService } from '../../../core/services/product/product.service';
import { SnackbarService } from '../../../shared/services/snackbar/snackbar.service';
@Component({
  selector: 'app-cart-update-dialog',
  imports: [ReactiveFormsModule, MatButtonModule, MatSelectModule, MatInputModule,
    MatFormFieldModule, FormsModule, MatDialogContent, MatDialogTitle],
  templateUrl: './cart-update-dialog.component.html',
  styleUrl: './cart-update-dialog.component.scss'
})
export class CartUpdateDialogComponent implements OnInit {
  updateForm: FormGroup
  public cartItem: CartItem
  public shoe: ShoeModel
  
  constructor(private fb: FormBuilder, private cartService: CartService,private snackbar : SnackbarService ,
    private productService: ProductService,
    private dialogRef: MatDialogRef<CartUpdateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { cartItem: CartItem }
  ) {
    this.cartItem = data.cartItem
    this.updateForm = this.fb.group({
      quantity: ['', Validators.required]
    })
  }

  ngOnInit(): void {
    this.updateForm.patchValue(this.cartItem)
    const shoes: ShoeModel[] = JSON.parse(localStorage.getItem('shoes'))
    this.shoe = shoes.find((p) => p.id === this.cartItem.productId)
  }

  public onSubmit() {
    if (this.updateForm.valid) {
      if (this.updateForm.value.quantity <= this.shoe.inventory) {
        let newCartItem: CartItem = { ...this.cartItem }
        let totcost = (this.shoe.cost * this.updateForm.value.quantity * (this.shoe.category.gst/100)) + this.shoe.cost * this.updateForm.value.quantity
        newCartItem.quantity = this.updateForm.value.quantity
        newCartItem.totalcost = totcost
        this.cartService.updateCartItem(newCartItem)
        this.dialogRef.close()
        let quant : number
        if(this.updateForm.value.quantity > this.cartItem.quantity){
          let newQ = this.updateForm.value.quantity - this.cartItem.quantity
          quant = this.shoe.inventory - newQ
        }
        else{
          let newQ = this.cartItem.quantity - this.updateForm.value.quantity
          quant = this.shoe.inventory + newQ
        }
        let newShoe: ShoeModel = {
          id: this.shoe.id,
          name: this.shoe.name,
          category: this.shoe.category,
          inventory: quant,
          cost: this.shoe.cost,
          img_url: this.shoe.img_url,
          description: this.shoe.description
        }
        this.productService.updateShoe(newShoe)
        this.snackbar.showSuccess("successfully updated the item")
      }
      else{
        this.snackbar.showError(`Not enough quantity in inventory,max(${this.shoe.inventory})`)
      }
    } 
  }

  public onClose() {
    this.dialogRef.close()
  }

}
