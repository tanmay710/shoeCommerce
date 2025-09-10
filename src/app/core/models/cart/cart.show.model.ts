import { CartItemShowModel } from "./cart.item.show.model"

export interface CartShowModel{
    userId : number
    items : CartItemShowModel[]
    totalAmount : number
}