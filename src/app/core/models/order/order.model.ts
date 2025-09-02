import { Cart } from "../cart/cart.model"

export interface Order{
    orderId : number
    userId : number
    cart : Cart
    orderDate : string
}