import { CartItem } from "./cart.item.model"

export interface Cart{
    userId : number
    items : CartItem[]
    totalAmount : number
}