import { Component, Inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CategoriesService } from '../../../core/services/categories/categories.service';
import { ShoeCategory } from '../../../core/models/product-category/product.category.model';
import { SnackbarService } from '../../../shared/services/snackbar/snackbar.service';
import { ProductService } from '../../../core/services/product/product.service';
@Component({
  selector: 'app-category-add-dialog',
  imports: [
    ReactiveFormsModule, MatButtonModule, MatSelectModule, MatInputModule,
    MatFormFieldModule, FormsModule, MatDialogContent, MatDialogTitle
  ],
  templateUrl: './category-add-dialog.component.html',
  styleUrl: './category-add-dialog.component.scss'
})
export class CategoryAddDialogComponent implements OnInit {
  public categoryAddForm: FormGroup
  public mode: string
  public category: ShoeCategory
  constructor(private categoriesService: CategoriesService, private dialogRef: MatDialogRef<CategoryAddDialogComponent>,
    private fb: FormBuilder, private snackbar: SnackbarService,
    @Inject(MAT_DIALOG_DATA) public data: { category: ShoeCategory, mode: string },
    private productService : ProductService
  ) {
    this.categoryAddForm = this.fb.group({
      id: [''],
      name: ['', Validators.required],
      gst: ['', [Validators.required, Validators.max(18)]]
    })
    this.mode = data.mode
    this.category = data.category
  }

  ngOnInit(): void {
    if (this.mode === 'update') {
      this.categoryAddForm.patchValue(this.category)
    }
  }

  onClose() {
    this.dialogRef.close()
  }

  onSubmit() {
    if (this.categoryAddForm.valid) {
      if (this.mode === 'add') {
        let existingCategories: ShoeCategory[] = this.categoriesService.getCategories()
        let lastcategory = existingCategories[existingCategories.length - 1]

        let newCategory: ShoeCategory = {
          id: lastcategory.id + 1,
          name: this.categoryAddForm.value.name.toLowerCase().trim(),
          gst: this.categoryAddForm.value.gst
        }
        this.categoriesService.addCategory(newCategory)
        this.snackbar.showSuccess('Successfully added a new category')
        this.dialogRef.close()
      }
      else{
        let updatedCategory : ShoeCategory = {
          id: this.category.id,
          name: this.categoryAddForm.value.name,
          gst: this.categoryAddForm.value.gst
        }
        this.categoriesService.updateCategory(updatedCategory)
        this.productService.updateShoeCategory(updatedCategory)
        this.snackbar.showSuccess('Successfully updated the category')
        this.dialogRef.close()
      }
    }
  }
}
