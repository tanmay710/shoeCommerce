import { CartItem } from "./cart.item.model"

export interface CartModel{
    userId : number
    items : CartItem[]
    totalAmount : number
}