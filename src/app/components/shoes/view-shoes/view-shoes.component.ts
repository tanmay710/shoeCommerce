import { AfterViewChecked, AfterViewInit, Component, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { ProductService } from '../../../core/services/product/product.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { TitleCasePipe } from '@angular/common';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { CategoriesService } from '../../../core/services/categories/categories.service';
import { MatInputModule } from '@angular/material/input';
import { MatSelect, MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { ProductModel } from '../../../core/models/product/product.model';
import { ProductCategory } from '../../../core/models/product-category/product.category.model';
import { ProductShowModel } from '../../../core/models/product/product-show.model';
import { ConfirmationDialogComponent } from '../../../shared/components/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-view-shoes',
  imports: [MatRadioModule, MatTableModule, MatButtonModule,
    MatInputModule, TitleCasePipe, MatPaginatorModule, MatIconModule,
    MatSortModule, MatSelectModule, MatFormFieldModule, FormsModule],
  templateUrl: './view-shoes.component.html',
  styleUrl: './view-shoes.component.scss'
})
export class ViewShoesComponent implements OnInit, AfterViewInit {

  public product: ProductModel[]
  public categories: ProductCategory[]
  public productDisplay: ProductShowModel[]

  public displayDropDown: DropDown[]
  public productDataSource: MatTableDataSource<ProductShowModel> = new MatTableDataSource([])
  public filteredDataSource: ProductModel[]
  public searchDataSource: ProductModel[]
  public stockDataSource: ProductModel[]
  public displayedColumns: string[] = ['name', 'category', 'inventory', 'cost','discount','details', 'actions']
  public search: string = ''
  public selectedCategory: string;
  public selectedStatus: string
  public filterObject: MyFilters = {
    nameSearch: '',
    categoryName: ''
  }
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private productService: ProductService, private router: Router,
    private categoriesService: CategoriesService, private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.product = this.productService.getShoes()
    this.categories = this.categoriesService.getCategories()
    this.productDisplay = this.product.map((p) => {
      let category = this.categories.find((c) => p.categoryId === c.id)
      return {
        id: p.id,
        name: p.name,
        category: category,
        inventory: p.inventory,
        cost: p.cost,
        img_url: p.img_url,
        description: p.description,
        discount : p.discount
      }
    })
    this.productDataSource.data = this.productDisplay
  }

  ngAfterViewInit(): void {
    this.productDataSource.sort = this.sort
    this.productDataSource.paginator = this.paginator
  }

  public onDetails(product: ProductModel) {
    this.router.navigate([`/shoe-details/${product.id}`])
  }

  public onUpdate(product: ProductModel) {
    this.router.navigate([`/shoe/update/${product.id}`])
  }

  public onDelete(product: ProductModel) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, { data: { message: 'Are you sure you want to delete this?' } })
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.productService.deleteShoe(product)
        this.product = this.productService.getShoes()
        this.productDisplay = this.product.map((p) => {
          let category = this.categories.find((c) => p.categoryId === c.id)
          return {
            id: p.id,
            name: p.name,
            category: category,
            inventory: p.inventory,
            cost: p.cost,
            img_url: p.img_url,
            description: p.description,
            discount : p.discount
          }
        })
        this.productDataSource.data = this.productDisplay
      }
      else{
        return
      }
    })

  }

  public onClick() {
    this.router.navigate(['/shoe/add'])
  }

  public applyFilter() {
    let tempData: ProductShowModel[] = [...this.productDisplay];
    tempData = this.productDisplay.filter((p) => p.name.toLowerCase().trim().includes(this.search.toLowerCase().trim()))

    if (this.selectedCategory && this.selectedCategory !== 'none') {
      tempData = tempData.filter((p) => p.category.name === this.selectedCategory)
    }
    if (this.selectedStatus && this.selectedStatus !== 'all') {
      if (this.selectedStatus === 'instock') {
        tempData = tempData.filter((p) => p.inventory > 0)
      }
      else {
        tempData = tempData.filter((p) => p.inventory === 0)
      }
    }
    this.productDataSource.data = tempData
  }
}

interface DropDown {
  id: number
  name: string
}

interface MyFilters {
  nameSearch: string
  categoryName: string
}