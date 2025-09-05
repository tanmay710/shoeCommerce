import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductService } from '../../../core/services/product/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ShoeModel } from '../../../core/models/product/product.model';
import { ShoeCategory } from '../../../core/models/product-category/product.category.model';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInput } from "@angular/material/input";
import { CategoriesService } from '../../../core/services/categories/categories.service';
import { MatSelectModule } from "@angular/material/select";
import { MatButton, MatButtonModule } from "@angular/material/button";
import { TitleCasePipe } from '@angular/common';
import { SnackbarService } from '../../../shared/services/snackbar/snackbar.service';

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
  public categories: ShoeCategory[]
  public isSubmit : boolean = false
  constructor(private productService: ProductService, private router: Router,
    private route: ActivatedRoute, private fb: FormBuilder, private categoriesService: CategoriesService,
    private snackbar : SnackbarService
  ) {
    this.shoeForm = this.fb.group({
      id: [''],
      name: ['', Validators.required],
      category: ['', Validators.required],
      description: ['', Validators.required],
      img_url: this.fb.array([]),
      inventory: ['', [Validators.required,Validators.min(1)]],
      cost: ['', [Validators.required,Validators.min(1)]]
    })
  }

  ngOnInit(): void {
    this.shoeId = +this.route.snapshot.paramMap.get('id')
    if (this.shoeId) {
      const shoes: ShoeModel[] = JSON.parse(localStorage.getItem('shoes'))
      const updateShoe = shoes.find((p) => p.id === this.shoeId)
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
        
        const categories: ShoeCategory[] = JSON.parse(localStorage.getItem('categories'))
        const newCategory = categories.find((p) => p.name.trim().toLowerCase() === this.shoeForm.value.category.toLowerCase().trim())
         let imgUrls = this.shoeForm.value.img_url.filter((p)=> p.trim() !== "")
        if(imgUrls.length ===0){
          let existingShoes: ShoeModel[] = this.productService.getShoes()
          let toUpdateShoe = existingShoes.find((p)=> p.id === this.shoeId)
          let updateShoe: ShoeModel = {
            id: this.shoeForm.value.id,
            name: this.shoeForm.value.name,
            category: {
              id: newCategory.id,
              name: newCategory.name
            },
            inventory: this.shoeForm.value.inventory,
            cost: this.shoeForm.value.cost,
            img_url: toUpdateShoe.img_url,
            description: this.shoeForm.value.description
          }
          this.productService.updateShoe(updateShoe)
          this.snackbar.showSuccess("successfully updated the shoe data")
          this.router.navigate(['/shoelist'])
        }
        else {
          let updateShoe: ShoeModel = {
            id: this.shoeForm.value.id,
            name: this.shoeForm.value.name,
            category: {
              id: newCategory.id,
              name: newCategory.name
            },
            inventory: this.shoeForm.value.inventory,
            cost: this.shoeForm.value.cost,
            img_url: this.shoeForm.value.img_url,
            description: this.shoeForm.value.description
          }
          console.log("hello",updateShoe);
        }
      }
      else {
        const existingShoes: ShoeModel[] = this.productService.getShoes()
        let lastShoe = existingShoes[existingShoes.length-1]
        let lastIndex = lastShoe.id
        const categories: ShoeCategory[] = JSON.parse(localStorage.getItem('categories'))
        const newCategory = categories.find((p) => p.name.trim().toLowerCase() === this.shoeForm.value.category.toLowerCase().trim())
        let imgUrls = this.shoeForm.value.img_url.filter((p)=> p.trim() !== "")
        if(imgUrls.length ===0){
          this.snackbar.showError("image url missing")
          return
        }
        else {
          const addShoe: ShoeModel = {
            id: lastIndex +1,
            name: this.shoeForm.value.name,
            category: {
              id: newCategory.id,
              name: newCategory.name
            },
            inventory: +this.shoeForm.value.inventory,
            cost: +this.shoeForm.value.cost,
            img_url: this.shoeForm.value.img_url,
            description: this.shoeForm.value.description
          }
          this.productService.addShoe(addShoe)
          this.snackbar.showSuccess("successfully added the shoe data")
          this.router.navigate(['/shoelist'])
        }
      }
    }
  }
} 
