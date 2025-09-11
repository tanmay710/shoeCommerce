import { Injectable } from '@angular/core';
import { CartModel } from '../../models/cart/cart.model';
import { CartItem } from '../../models/cart/cart.item.model';
import { UserModel } from '../../models/user/user.model';
import { BehaviorSubject } from 'rxjs';
import { UserService } from '../user/user.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private cartSize = new BehaviorSubject<number>(0)
  public cartSize$ = this.cartSize.asObservable()
  public currentUser: UserModel
  public userId: number
  constructor(private userService: UserService) {
    this.currentUser = userService.getCurrentUser()
   
    if(this.currentUser){
       this.userId = this.currentUser.id
    }
    let allCarts: CartModel[] = JSON.parse(localStorage.getItem('carts'))
    let cart = this.getUserCart()
    this.cartSize.next(cart?.items.length)
  }

  public loginCartSize(){
    let cart = this.getUserCart()
    if(cart){
      return this.cartSize.next(cart?.items.length)
    }
    else{
       return this.cartSize.next(0)
    }
    
  }

  public logoutCartSize(){
    return this.cartSize.next(0)
  }

  public getCart() {
    let cart = JSON.parse(localStorage.getItem('carts')) || []
    return cart
  }

  public getUserCart() {
    let currentUser: UserModel = this.userService.getCurrentUser()
    let allCarts: CartModel[] = this.getCart()
    let userCart: CartModel = allCarts.find((p) => p.userId === currentUser?.id)
    return userCart
  }

  public addCartItem(cart: CartModel, cartItem: CartItem) {

    const existingCart: CartModel = this.getUserCart()
    let allCarts: CartModel[] = this.getCart()
    if (existingCart) {
      existingCart.items.push(cartItem)
      existingCart.totalAmount = existingCart.items.reduce((sum, item) => sum + item.totalcost, 0)
      let index = allCarts.findIndex((p) => p.userId === existingCart.userId)
      allCarts[index] = existingCart
      localStorage.setItem('carts', JSON.stringify(allCarts))
      this.cartSize.next(existingCart.items.length)
    }
    else {
      allCarts.push(cart)
      localStorage.setItem('carts', JSON.stringify(allCarts))
      this.cartSize.next(cart.items.length)
    }
  }

  public updateCartItem(cartItem: CartItem) {
    const existingCart: CartModel = this.getUserCart()
    let allCarts : CartModel[] = this.getCart()
    let index = allCarts.findIndex((p)=> p.userId === existingCart.userId)
    let itemId = existingCart.items.findIndex((p) => p.productId === cartItem.productId)
    existingCart.items[itemId] = { ...cartItem }
    existingCart.totalAmount = existingCart.items.reduce((sum, item) => sum + item.totalcost, 0)
    allCarts[index] = existingCart
    localStorage.setItem('carts', JSON.stringify(allCarts))

  }

  public removeCartItem(cartItem: CartItem) {
    let existingCart: CartModel = this.getUserCart()
    let allCarts: CartModel[] = this.getCart()
    let newcartItems: CartItem[] = existingCart.items.filter((p) => p.productId !== cartItem.productId)
    existingCart.items = [...newcartItems]
    existingCart.totalAmount = existingCart.items.reduce((sum, item) => sum + item.totalcost, 0)
    if (existingCart.items.length === 0) {
      allCarts = allCarts.filter((p) => p.userId !== existingCart.userId)
      localStorage.setItem('carts', JSON.stringify(allCarts))
    }
    else {
      let index = allCarts.findIndex((p) => p.userId === existingCart.userId)
      allCarts[index] = { ...existingCart }
      localStorage.setItem('carts', JSON.stringify(allCarts))
    }
    this.cartSize.next(existingCart.items.length)
  }

  public removeCart() {
    let allCarts : CartModel[] = this.getCart()
    allCarts = allCarts.filter((p)=> p.userId !== this.userId)
    localStorage.setItem('carts',JSON.stringify(allCarts))
    this.cartSize.next(0)
  }

  
}
