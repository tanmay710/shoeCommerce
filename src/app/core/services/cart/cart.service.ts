import { Injectable } from '@angular/core';
import { Cart } from '../../models/cart/cart.model';
import { CartItem } from '../../models/cart/cart.item.model';
import { UserModel } from '../../models/user/user.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private cartSize = new BehaviorSubject<number>(0)
  public cartSize$ = this.cartSize.asObservable()
  constructor() { }

  public getCart(){
    let cart = JSON.parse(localStorage.getItem('cart'))
    return cart
  }
  
  public addCartItem(cart : Cart,cartItem : CartItem){
    
    const existingCart: Cart = JSON.parse(localStorage.getItem('cart'))
    if(existingCart){
      existingCart.items.push(cartItem)
      existingCart.totalAmount = existingCart.items.reduce((sum, item) => sum + (item.cost * item.quantity), 0)
      localStorage.setItem('cart',JSON.stringify(existingCart))
      this.cartSize.next(existingCart.items.length)
    }
    else{
      localStorage.setItem('cart',JSON.stringify(cart))
      this.cartSize.next(cart.items.length)
    }
    
  }

  public updateCartItem(cartItem : CartItem){
    const existingCart: Cart = JSON.parse(localStorage.getItem('cart'))
    let itemId = existingCart.items.findIndex((p)=> p.productId === cartItem.productId)
    if(itemId !== -1){
      existingCart.items[itemId] = {...cartItem}
      existingCart.totalAmount = existingCart.items.reduce((sum, item) => sum + (item.cost * item.quantity), 0)
      localStorage.setItem('cart',JSON.stringify(existingCart))
    }
  }

  public removeCartItem(cartItem : CartItem){
    const existingCart: Cart = JSON.parse(localStorage.getItem('cart'))
    let itemId = existingCart.items.findIndex((p)=> p.productId === cartItem.productId)
    let newcartItems : CartItem[] = existingCart.items.filter((p)=> p.productId !== cartItem.productId)
    existingCart.items = [...newcartItems]
    existingCart.totalAmount = existingCart.items.reduce((sum, item) => sum + (item.cost * item.quantity), 0)
    if(existingCart.items.length === 0){
      localStorage.removeItem('cart')
    }
    else{
          localStorage.setItem('cart',JSON.stringify(existingCart))
    }
    this.cartSize.next(existingCart.items.length)
  }

  public removeCart(){
    const existingCart: Cart = JSON.parse(localStorage.getItem('cart'))
    localStorage.removeItem('cart')
    this.cartSize.next(existingCart?.items.length)
  }
}
