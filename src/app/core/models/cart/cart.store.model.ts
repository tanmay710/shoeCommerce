import { CartItemStoreModel } from "./cart.item.store.model"

export interface CartStoreModel{
    userId : number
    items : CartItemStoreModel[]
}