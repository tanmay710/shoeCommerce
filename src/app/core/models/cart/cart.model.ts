import { CartItemShowModel } from "./cart.item.model"

export interface CartShowModel{
    userId : number
    items : CartItemShowModel[]
    totalAmount : number
}