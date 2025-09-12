import { CartItemShowModel } from "../cart/cart.item.model"

export interface Order{
    orderId : number
    userId : number
    items : CartItemShowModel[]
    totalAmount : number
    orderDate : string
}