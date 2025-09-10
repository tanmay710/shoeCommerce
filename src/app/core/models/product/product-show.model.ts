import { ProductCategory } from "../product-category/product.category.model"

export interface ProductShowModel{
    id : number
    name : string
    category : ProductCategory
    inventory : number
    cost : number
    img_url : string[]
    description : string
}