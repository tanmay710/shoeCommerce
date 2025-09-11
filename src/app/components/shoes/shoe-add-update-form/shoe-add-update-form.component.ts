import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductService } from '../../../core/services/product/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInput } from "@angular/material/input";
import { CategoriesService } from '../../../core/services/categories/categories.service';
import { MatSelectModule } from "@angular/material/select";
import { MatButton, MatButtonModule } from "@angular/material/button";
import { TitleCasePipe } from '@angular/common';
import { SnackbarService } from '../../../shared/services/snackbar/snackbar.service';
import { ProductCategory } from '../../../core/models/product-category/product.category.model';
import { ProductModel } from '../../../core/models/product/product.model';

@Component({
  selector: 'app-shoe-add-update-form',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInput, MatSelectModule, MatButtonModule,TitleCasePipe],
  templateUrl: './shoe-add-update-form.component.html',
  styleUrl: './shoe-add-update-form.component.scss'
})
export class ShoeAddUpdateFormComponent implements OnInit {
  public mode: string = 'add'
  public shoeForm: FormGroup
  public shoeId: number
  public categories: ProductCategory[]
  public isSubmit : boolean = false
  constructor(private productService: ProductService, private router: Router,
    private route: ActivatedRoute, private fb: FormBuilder, private categoriesService: CategoriesService,
    private snackbar : SnackbarService
  ) {
    this.shoeForm = this.fb.group({
      id: [''],
      name: ['', Validators.required],
      categoryId: ['', Validators.required],
      description: ['', Validators.required],
      img_url: this.fb.array([]),
      inventory: ['', [Validators.required]],
      cost: ['', [Validators.required,Validators.min(1)]],
      discount : ['',[Validators.required,Validators.min(0)]]
    })
    this.getUrlArray().push(this.fb.control(''))
  }

  ngOnInit(): void {
    this.shoeId = +this.route.snapshot.paramMap.get('id')
    if (this.shoeId) {
      const shoes: ProductModel[] = this.productService.getShoes()
      const updateShoe = shoes.find((p) => p.id === this.shoeId)
      console.log(updateShoe);
      this.shoeForm.patchValue(updateShoe)
      this.mode = 'update'
    }
    this.categories = this.categoriesService.getCategories()
  }

  public getUrlArray(): FormArray {
    return this.shoeForm.get('img_url') as FormArray
  }

  public addUrl() { 
    this.getUrlArray().push(this.fb.control(''))
  }

  public removeUrl(index: number) {
    this.getUrlArray().removeAt(index)
  }

  public onSubmit() {
    this.isSubmit = true
    if (this.shoeForm.valid) {
      if (this.mode === 'update') {
        console.log("update");
        
         let imgUrls = this.shoeForm.value.img_url.filter((p)=> p.trim() !== "")
        if(imgUrls.length ===0){
          let existingShoes: ProductModel[] = this.productService.getShoes()
          let toUpdateShoe = existingShoes.find((p)=> p.id === this.shoeId)
          let updateShoe: ProductModel = {
            id: this.shoeForm.value.id,
            name: this.shoeForm.value.name,
            categoryId: this.shoeForm.value.categoryId,
            inventory: this.shoeForm.value.inventory,
            cost: this.shoeForm.value.cost,
            img_url: toUpdateShoe.img_url,
            description: this.shoeForm.value.description,
            discount : this.shoeForm.value.discount
          }
          this.productService.updateShoe(updateShoe)
          this.categoriesService.updatedProductInCart(updateShoe)
          this.snackbar.showSuccess("successfully updated the shoe data")
          this.router.navigate(['/shoelist'])
        }
        else {
          let updateShoe: ProductModel = {
            id: this.shoeForm.value.id,
            name: this.shoeForm.value.name,
            categoryId: this.shoeForm.value.categoryId,
            inventory: this.shoeForm.value.inventory,
            cost: this.shoeForm.value.cost,
            img_url: this.shoeForm.value.img_url,
            description: this.shoeForm.value.description,
            discount : this.shoeForm.value.discount
          }
          this.productService.updateShoe(updateShoe)
          this.categoriesService.updatedProductInCart(updateShoe)
          this.snackbar.showSuccess("successfully updated the shoe data")
        }
      }
      else {
        const existingShoes: ProductModel[] = this.productService.getShoes()
        let lastShoe = existingShoes[existingShoes.length-1]
        let lastIndex = lastShoe.id
        let imgUrls = this.shoeForm.value.img_url.filter((p)=> p.trim() !== "")
        if(imgUrls.length ===0){
          this.snackbar.showError("image url missing")
          this.snackbar.showSnackbar("image url missing", 'Error')
          return
        }
        else {
          const addShoe: ProductModel = {
            id: lastIndex +1,
            name: this.shoeForm.value.name,
            categoryId: this.shoeForm.value.categoryId ,
            inventory: +this.shoeForm.value.inventory,
            cost: +this.shoeForm.value.cost,
            img_url: this.shoeForm.value.img_url,
            description: this.shoeForm.value.description,
            discount : this.shoeForm.value.discount
          }
          this.productService.addShoe(addShoe)
          this.snackbar.showSuccess("successfully added the shoe data")
          this.router.navigate(['/shoelist'])
        }
      }
    }
  }
} 
