import { Injectable } from '@angular/core';
import { UserModel } from '../../models/user/user.model';
import { BehaviorSubject } from 'rxjs';
import { UserService } from '../user/user.service';
import { CartItemStoreModel } from '../../models/cart/cart.item.store.model';
import { CartStoreModel } from '../../models/cart/cart.store.model';

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
    let allCarts: CartStoreModel[] = JSON.parse(localStorage.getItem('carts'))
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
    let allCarts: CartStoreModel[] = this.getCart()
    let userCart: CartStoreModel = allCarts.find((p) => p.userId === currentUser?.id)
    return userCart
  }

  public addCartItem(cart: CartStoreModel, cartItem: CartItemStoreModel) {

    const existingCart: CartStoreModel = this.getUserCart()
    let allCarts: CartStoreModel[] = this.getCart()
    if (existingCart) {
      existingCart.items.push(cartItem)
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

  public updateCartItem(cartItem: CartItemStoreModel) {
    const existingCart: CartStoreModel = this.getUserCart()
    let allCarts : CartStoreModel[] = this.getCart()
    let index = allCarts.findIndex((p)=> p.userId === existingCart.userId)
    let itemId = existingCart.items.findIndex((p) => p.productId === cartItem.productId)
    existingCart.items[itemId] = { ...cartItem }
    allCarts[index] = existingCart
    localStorage.setItem('carts', JSON.stringify(allCarts))

  }

  public removeCartItem(cartItem: CartItemStoreModel) {
    let existingCart: CartStoreModel = this.getUserCart()
    let allCarts: CartStoreModel[] = this.getCart()
    let newcartItems: CartItemStoreModel[] = existingCart.items.filter((p) => p.productId !== cartItem.productId)
    existingCart.items = [...newcartItems]
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
    let allCarts : CartStoreModel[] = this.getCart()
    allCarts = allCarts.filter((p)=> p.userId !== this.userId)
    localStorage.setItem('carts',JSON.stringify(allCarts))
    this.cartSize.next(0)
  }

  
}
