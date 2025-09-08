import { AfterViewChecked, AfterViewInit, Component, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { ProductService } from '../../../core/services/product/product.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { TitleCasePipe } from '@angular/common';
import { Router } from '@angular/router';
import { ShoeModel } from '../../../core/models/product/product.model';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { ShoeCategory } from '../../../core/models/product-category/product.category.model';
import { CategoriesService } from '../../../core/services/categories/categories.service';
import { MatInputModule } from '@angular/material/input';
import { MatSelect, MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-view-shoes',
  imports: [MatRadioModule, MatTableModule, MatButtonModule,
    MatInputModule, TitleCasePipe, MatPaginatorModule, MatIconModule,
    MatSortModule, MatSelectModule, MatFormFieldModule, FormsModule],
  templateUrl: './view-shoes.component.html',
  styleUrl: './view-shoes.component.scss'
})
export class ViewShoesComponent implements OnInit, AfterViewInit {

  public shoes: ShoeModel[]
  public categories: ShoeCategory[]
  public displayDropDown: DropDown[]
  public dataSource: MatTableDataSource<ShoeModel> = new MatTableDataSource([])
  public filteredDataSource: ShoeModel[]
  public searchDataSource: ShoeModel[]
  public stockDataSource: ShoeModel[]
  public displayedColumns: string[] = ['name', 'category', 'inventory', 'cost', 'details', 'actions']
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
    private categoriesService: CategoriesService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.shoes = this.productService.getShoes()
    this.filteredDataSource = this.shoes
    this.searchDataSource = this.shoes;
    this.dataSource.data = this.shoes
    this.categories = this.categoriesService.getCategories()
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort
    this.dataSource.paginator = this.paginator
  }

  public onDetails(shoe: ShoeModel) {
    this.router.navigate([`/shoe-details/${shoe.id}`])
  }

  public onUpdate(shoe: ShoeModel) {
    this.router.navigate([`/shoe/update/${shoe.id}`])
  }

  public onDelete(shoe: ShoeModel) {
    const confirmation = confirm("Are you sure you want to delete this")
    if (confirmation) {
      this.productService.deleteShoe(shoe)
      this.shoes = this.productService.getShoes()
      this.dataSource = new MatTableDataSource(this.shoes)
    }
  }

  public onClick() {
    this.router.navigate(['/shoe/add'])
  }

  public applyCategoryFilter() {
    if (this.selectedCategory !== 'none') {
      this.searchDataSource = this.searchDataSource.filter((p) => p.category.name === this.selectedCategory)
      this.dataSource.data = this.searchDataSource
    }
    else {
      this.applySearchFilter()
    }
  }

  public applyStockFilter() {
    if (this.selectedStatus !== 'all') {
      this.searchDataSource = this.searchDataSource.filter((p) => p.category.name === this.selectedCategory)
      this.dataSource.data = this.searchDataSource
    }
    else {
      this.applySearchFilter()
    }
  }

  public applySearchFilter() {
    this.searchDataSource = this.shoes.filter((p) => p.name.toLowerCase().trim().includes(this.search.toLowerCase().trim()))
    this.dataSource.data = this.searchDataSource
  }
  // let tempData: ShoeModel[] = [...this.shoes];
  // tempData = this.shoes.filter((p) => p.name.toLowerCase().trim().includes(this.search.toLowerCase().trim()))

  // if (this.selectedCategory && this.selectedCategory !== 'none') {
  //   tempData = tempData.filter((p) => p.category.name === this.selectedCategory)
  // }
  // if (this.selectedStatus && this.selectedStatus !== 'all') {
  //   if (this.selectedStatus === 'instock') {
  //     tempData = tempData.filter((p) => p.inventory > 0)
  //   }
  //   else {
  //     tempData = tempData.filter((p) => p.inventory === 0)
  //   }
  // }
  // this.dataSource.data = tempData 


}

interface DropDown {
  id: number
  name: string
}

interface MyFilters {
  nameSearch: string
  categoryName: string
}