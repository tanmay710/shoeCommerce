import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  constructor() { }

  public getCategories(){
    return JSON.parse(localStorage.getItem('categories'))
  }
}
