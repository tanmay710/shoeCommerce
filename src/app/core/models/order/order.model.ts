import { CartModel } from "../cart/cart.model"

export interface Order{
    orderId : number
    userId : number
    cart : CartModel
    orderDate : string
}