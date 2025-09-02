import { Injectable } from '@angular/core';
import { Cart } from '../../models/cart/cart.model';
import { CartItem } from '../../models/cart/cart.item.model';
import { UserModel } from '../../models/user/user.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {

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
    }
    else{
      localStorage.setItem('cart',JSON.stringify(cart))
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

  public removeCart(){
    localStorage.removeItem('cart')
  }
}
