import { ShoeCategory } from "../product-category/product.category.model"

export interface ShoeModel{
    id : number
    name : string
    category : ShoeCategory
    inventory : number
    cost : number
    img_url : string[]
    description : string
}