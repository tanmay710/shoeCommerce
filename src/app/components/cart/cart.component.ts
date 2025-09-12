import { Component, OnInit } from '@angular/core';
import { CartService } from '../../core/services/cart/cart.service';
import { UserModel } from '../../core/models/user/user.model';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CartItemShowModel } from '../../core/models/cart/cart.item.model';
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
import { CategoriesService } from '../../core/services/categories/categories.service';
import { ConfirmationDialogComponent } from '../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { CartStoreModel } from '../../core/models/cart/cart.store.model';
import { CartShowModel } from '../../core/models/cart/cart.model';

@Component({
  selector: 'app-checkout',
  imports: [MatTableModule, MatButtonModule, TitleCasePipe],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent {
  public userCart: CartStoreModel
  public userCartShow: CartShowModel
  public showUserCart: CartItemShowModel[]
  public currentUser: UserModel
  public cartDataSource: MatTableDataSource<CartItemShowModel>
  public categories: ProductCategory[]
  public products: ProductModel[]
  public displayedColumns: string[] = ['name', 'cost', 'quantity', 'totalcost', 'discount', 'discountPrice', 'afterDiscount', 'categorygst', 'gst', 'totalcostgst', 'changequantity', 'remove']

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
    this.currentUser = this.userService.getCurrentUser()
    this.categories = this.categoryService.getCategories()
    this.products = this.productService.getShoes()
    this.showUserCart = this.userCart?.items.map((item) => {
      let product: ProductModel = this.products.find((prod) => prod.id === item.productId)
      let category: ProductCategory = this.categories.find((cat) => cat.id === product.categoryId)
      let basePrice = product.cost * item.quantity
      let discountPrice = (product.cost * item.quantity) * (product.discount / 100)
      let priceAfterDiscount = basePrice - discountPrice
      let gstPrice = priceAfterDiscount * (category.gst / 100)
      let priceAfterGst = priceAfterDiscount + gstPrice
      return {
        productId: product.id,
        productName: product.name,
        productCost: product.cost,
        productDiscount: product.discount,
        gst: category.gst,
        quantity: item.quantity,
        totalcost: priceAfterGst
      }
    })
    let totAmount = this.showUserCart.reduce((sum, item) => sum + item.totalcost, 0)
    this.userCartShow = {
      userId: this.userCart.userId,
      items: this.showUserCart,
      totalAmount: totAmount
    }
    this.cartDataSource = new MatTableDataSource(this.showUserCart)
  }

  public onConfirm() {
      let stillInInventory: boolean = true
      this.userCart.items.forEach((item) => {
        let prod = this.products.find((p) => p.id === item.productId)
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
              orderId: lastOrderIndex + 1,
              userId: this.currentUser.id,
              items: this.showUserCart,
              orderDate: orderDate.toISOString(),
              totalAmount: this.userCartShow.totalAmount
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

  public changeQuantity(shoe: CartItemShowModel) {
    const dialogRef = this.dialog.open(CartUpdateDialogComponent, { data: { cartItem: shoe } })
    dialogRef.afterClosed().subscribe(result => {
      this.userCart = this.cartService.getUserCart()
      this.showUserCart = this.userCart?.items.map((item) => {
        let product: ProductModel = this.products.find((prod) => prod.id === item.productId)
        let category: ProductCategory = this.categories.find((cat) => cat.id === product.categoryId)
        let basePrice = product.cost * item.quantity
        let discountPrice = (product.cost * item.quantity) * (product.discount / 100)
        let priceAfterDiscount = basePrice - discountPrice
        let gstPrice = priceAfterDiscount * (category.gst / 100)
        let priceAfterGst = priceAfterDiscount + gstPrice
        return {
          productId: product.id,
          productName: product.name,
          productCost: product.cost,
          productDiscount: product.discount,
          gst: category.gst,
          quantity: item.quantity,
          totalcost: priceAfterGst
        }
      })
      let totAmount = this.showUserCart.reduce((sum, item) => sum + item.totalcost, 0)
      this.userCartShow = {
        userId: this.userCart.userId,
        items: this.showUserCart,
        totalAmount: totAmount
      }
      this.cartDataSource.data = this.showUserCart
    })
  }

  public removeItem(product: CartItemShowModel) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, { data: { message: 'Are you sure you want to remove this item?' } })
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.cartService.removeCartItem(product)
        this.userCart = this.cartService.getUserCart()
        this.showUserCart = this.userCart?.items.map((item) => {
          let product: ProductModel = this.products.find((prod) => prod.id === item.productId)
          let category: ProductCategory = this.categories.find((cat) => cat.id === product.categoryId)
          let basePrice = product.cost * item.quantity
          let discountPrice = (product.cost * item.quantity) * (product.discount / 100)
          let priceAfterDiscount = basePrice - discountPrice
          let gstPrice = priceAfterDiscount * (category.gst / 100)
          let priceAfterGst = priceAfterDiscount + gstPrice
          return {
            productId: product.id,
            productName: product.name,
            productCost: product.cost,
            productDiscount: product.discount,
            gst: category.gst,
            quantity: item.quantity,
            totalcost: priceAfterGst
          }
        })
        let totAmount = this.showUserCart.reduce((sum, item) => sum + item.totalcost, 0)
        this.userCartShow = {
          userId: this.userCart.userId,
          items: this.showUserCart,
          totalAmount: totAmount
        }
        this.cartDataSource.data = this.showUserCart
        this.snackbar.showSuccess("Removed item")
      }
      else {
        return
      }
    })
  }

}

