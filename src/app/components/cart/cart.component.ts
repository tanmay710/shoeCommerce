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
import { ShoeModel } from '../../core/models/product/product.model';
import { MatDialog } from '@angular/material/dialog';
import { CartUpdateDialogComponent } from './cart-update-dialog/cart-update-dialog.component';
import { ProductService } from '../../core/services/product/product.service';
import { SnackbarService } from '../../shared/services/snackbar/snackbar.service';
import { UserService } from '../../core/services/user/user.service';

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
  public displayedColumns: string[] = ['name', 'cost', 'quantity','changequantity','remove']
  constructor(private cartService : CartService,private productService : ProductService,
    private orderService : OrderService,
    private router : Router,private dialog : MatDialog,
    private snackbar : SnackbarService,private userService : UserService){}
  ngOnInit(): void {
    this.userCart = this.cartService.getCart()
    this.dataSource = new MatTableDataSource(this.userCart?.items)  
    this.user = this.userService.getCurrentUser()
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
      this.snackbar.showSuccess("Successfully Ordered")
      this.cartService.removeCart()
      this.router.navigate(['/orders'])
    }
  }

  public onClick(){
    this.router.navigate(['/shoelist'])
  }

  public onDelete(){
    const confirmation = confirm("Are you sure you want to delete this cart")
    if(confirmation){
      this.cartService.removeCart()
      this.router.navigate(['/shoelist'])
    }
  }

  public changeQuantity(shoe : CartItem){  
   const dialogRef =  this.dialog.open(CartUpdateDialogComponent,{data : {cartItem : shoe}})
    dialogRef.afterClosed().subscribe(result =>{
      this.userCart = this.cartService.getCart()
      this.dataSource = new MatTableDataSource(this.userCart?.items) 
    })
  }

  public removeItem(shoe : CartItem){
    const confirmation = confirm("Are you sure you want to remove this item")
    if(confirmation){
      let quant : number = shoe.quantity
      let existingShoes : ShoeModel[] = JSON.parse(localStorage.getItem('shoes'))
      let newShoe : ShoeModel = existingShoes.find((p)=> p.id === shoe.productId)
      newShoe.inventory = newShoe.inventory + shoe.quantity
      this.productService.updateShoe(newShoe)
      this.cartService.removeCartItem(shoe)
      this.userCart = this.cartService.getCart()
      this.dataSource = new MatTableDataSource(this.userCart?.items)
      this.snackbar.showSuccess("Removed item")
    }
  }
}
