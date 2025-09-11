import { Component, OnInit } from '@angular/core';
import { CartModel } from '../../core/models/cart/cart.model';
import { CartService } from '../../core/services/cart/cart.service';
import { UserModel } from '../../core/models/user/user.model';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CartItem } from '../../core/models/cart/cart.item.model';
import { MatButtonModule } from '@angular/material/button';
import { TitleCasePipe } from '@angular/common';
import { Order } from '../../core/models/order/order.model';
import { OrderService } from '../../core/services/order/order.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { CartUpdateDialogComponent } from './cart-update-dialog/cart-update-dialog.component';
import { ProductService } from '../../core/services/product/product.service';
import { SnackbarService } from '../../shared/services/snackbar/snackbar.service';
import { UserService } from '../../core/services/user/user.service';
import { ProductModel } from '../../core/models/product/product.model';
import { ProductCategory } from '../../core/models/product-category/product.category.model';
import { CartItemShowModel } from '../../core/models/cart/cart.item.show.model';
import { CategoriesService } from '../../core/services/categories/categories.service';
import { ConfirmationDialogComponent } from '../../shared/components/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-checkout',
  imports: [MatTableModule, MatButtonModule, TitleCasePipe],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent implements OnInit {
  public userCart: CartModel
  public showUserCart: CartItemShowModel[]
  public user: UserModel
  public currentUser: UserModel
  public cartDataSource: MatTableDataSource<CartItem>
  public categories: ProductCategory[]
  public displayedColumns: string[] = ['name', 'cost', 'quantity', 'totalcost','discount','discountPrice','afterDiscount', 'categorygst', 'gst', 'totalcostgst', 'changequantity', 'remove']

  constructor(private cartService: CartService,
    private productService: ProductService,
    private orderService: OrderService,
    private categoryService: CategoriesService,
    private router: Router, private dialog: MatDialog,
    private snackbar: SnackbarService,
    private userService: UserService,
  ) { }

  ngOnInit(): void {
    this.userCart = this.cartService.getUserCart()
    this.categories = this.categoryService.getCategories()
    this.showUserCart = this.userCart?.items.map((p) => {
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
    this.cartDataSource = new MatTableDataSource(this.userCart.items)
    this.user = this.userService.getCurrentUser()

  }

  public onConfirm() {
    let allProds: ProductModel[] = this.productService.getShoes()
    let stillInInventory: boolean = true
    this.userCart.items.forEach((item) => {
      let prod = allProds.find((p) => p.id === item.productId)
      if (prod && item.quantity > prod.inventory) {
        stillInInventory = false
        this.snackbar.showSnackbar(`Our inventory does not have this much quantity for ${prod.name}(${prod.inventory})`, 'Error')
        return
      }
    })
    if (stillInInventory) {
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, { data: { message: 'Do you confirm your order' } })
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          let allOrders = this.orderService.getAllOrders()
          let lastOrder = allOrders[allOrders.length - 1]
          let lastOrderIndex: number
          let orderDate = new Date()
          if (lastOrder) {
            lastOrderIndex = lastOrder.orderId
          }
          else {
            lastOrderIndex = 0
          }
          let order: Order = {
            userId: this.user.id,
            cart: this.userCart,
            orderId: lastOrderIndex + 1,
            orderDate: orderDate.toLocaleString()
          }
          let allShoes: ProductModel[] = this.productService.getShoes()
          for (let i = 0; i < this.userCart.items.length; i++) {
            let shoe: ProductModel = allShoes.find((p) => p.id === this.userCart.items[i].productId)
            shoe.inventory = shoe.inventory - this.userCart.items[i].quantity
            this.productService.updateShoe(shoe)
          }
          this.orderService.addOrder(order)
          this.cartService.removeCart()
          this.snackbar.showSnackbar("Successfully Ordered", 'Success')
          this.router.navigate(['/orders'])
        }
        else {
          return
        }
      })
    }

  }

  public onClick() {
    this.router.navigate(['/shoelist'])
  }

  public changeQuantity(shoe: CartItem) {
    console.log(shoe);

    const dialogRef = this.dialog.open(CartUpdateDialogComponent, { data: { cartItem: shoe } })
    dialogRef.afterClosed().subscribe(result => {
      this.userCart = this.cartService.getUserCart()
      this.showUserCart = this.userCart?.items.map((p) => {
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
      this.cartDataSource.data = this.userCart.items
    })
  }

  public removeItem(product: CartItem) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, { data: { message: 'Are you sure you want to remove this item?' } })
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.cartService.removeCartItem(product)
        this.userCart = this.cartService.getUserCart()
        this.showUserCart = this.userCart?.items.map((p) => {
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
        this.cartDataSource.data = this.userCart.items
        this.snackbar.showSuccess("Removed item")
      }
      else{
        return
      }
    })

  }
}
