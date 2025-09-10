import { Injectable } from '@angular/core';
import { ProductCategory } from '../../models/product-category/product.category.model';

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

  constructor() { }

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

}
