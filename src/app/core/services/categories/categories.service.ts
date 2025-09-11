import { Injectable } from '@angular/core';
import { ProductCategory } from '../../models/product-category/product.category.model';
import { CartService } from '../cart/cart.service';
import { CartModel } from '../../models/cart/cart.model';
import { ProductModel } from '../../models/product/product.model';
import { ProductService } from '../product/product.service';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  public baseProducts : ProductCategory[] = [{
    id: 1,
    name: 'sport',
    gst: 18
  },
{
  id: 2,
  name: 'formal',
  gst: 18
},
{
  id: 3,
  name: 'casual',
  gst: 18
},]

  constructor(private cartService : CartService,private productService : ProductService) { }

  storeDetails(){
    localStorage.setItem('categories',JSON.stringify(this.baseProducts))
  }

  public getCategories(){
    return JSON.parse(localStorage.getItem('categories'))
  }

  public addCategory(category : ProductCategory){
    let existingCategory : ProductCategory[] = this.getCategories()
    existingCategory.push(category)
    localStorage.setItem('categories',JSON.stringify(existingCategory))
  }

  public updateCategory(category : ProductCategory){
    let existingCategory : ProductCategory[] = this.getCategories()
    let index = existingCategory.findIndex((p)=> p.id === category.id)
    existingCategory[index] = {...category}
    localStorage.setItem('categories',JSON.stringify(existingCategory))
  }

  public updateCategoryGstInsideCart(category : ProductCategory){
    let allCarts: CartModel[] = this.cartService.getCart()
    let allProducts : ProductModel[] = this.productService.getShoes()
    allCarts.forEach((cart)=> {
      cart.items.forEach((item)=> {
        let prod = allProducts.find((p)=> p.id === item.productId)
        if(prod && prod.categoryId === category.id){
          let basePrice = prod.cost * item.quantity
          let gstAmount = basePrice* (category.gst/100)
          item.totalcost = basePrice + gstAmount
        }
      })
      cart.totalAmount = cart.items.reduce((sum,item)=> sum + item.totalcost,0)
    })
    localStorage.setItem('carts',JSON.stringify(allCarts))
  }

  public updatedProductInCart(product : ProductModel){
    let allCarts: CartModel[] = this.cartService.getCart()
    let allCategory : ProductCategory[] = this.getCategories()
    let category : ProductCategory = allCategory.find((c)=> c.id === product.categoryId)
    allCarts.forEach((cart)=>{
      cart.items.forEach((item)=>{
        if(item.productId === product.id){
          item.productName = product.name
          item.productCost = product.cost
          item.productDiscount = product.discount
          item.gst = category.gst
          let basePrice = product.cost * item.quantity
          let discountPrice = basePrice * (product.discount/100)
          let afteDiscount = basePrice - discountPrice
          let gstAmount = afteDiscount* (category.gst/100)
          item.totalcost = afteDiscount + gstAmount
        }
      })
      cart.totalAmount = cart.items.reduce((sum,item)=> sum + item.totalcost,0)
    })
    localStorage.setItem('carts',JSON.stringify(allCarts))
  }
}
