import { CartShowModel } from "../cart/cart.show.model"

export interface OrderShow{
    orderId : number
    userId : number
    cart : CartShowModel
    orderDate : string
}