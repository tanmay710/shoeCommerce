import { AfterViewChecked, AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
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
import { MatRadioChange, MatRadioModule } from '@angular/material/radio';
import { ShoeCategory } from '../../../core/models/product-category/product.category.model';
import { CategoriesService } from '../../../core/services/categories/categories.service';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-view-shoes',
  imports: [MatRadioModule,MatTableModule,MatButtonModule,MatInputModule, TitleCasePipe, MatIconModule,MatSortModule,MatFormFieldModule,FormsModule],
  templateUrl: './view-shoes.component.html',
  styleUrl: './view-shoes.component.scss'
})
export class ViewShoesComponent implements OnInit,AfterViewInit {

  public shoes: ShoeModel[]
  public categories : ShoeCategory[]
  public dataSource: MatTableDataSource<ShoeModel>
  public displayedColumns: string[] = ['name', 'category', 'inventory', 'cost', 'details', 'actions']
  public search : string= ''
  selectedCategory: string = 'all';
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private productService: ProductService, private router: Router,private categoriesService : CategoriesService) { }

  ngOnInit(): void {
    this.shoes = this.productService.getShoes()
    this.dataSource = new MatTableDataSource(this.shoes)  
    this.categories = this.categoriesService.getCategories()
    this.dataSource.filterPredicate = (data : ShoeModel, filter : string) =>{
      if(filter === '4'){
        return true
      }
      else if(filter === '1'){
        return data.category.name === 'sport'
      }
      else if(filter === '2'){
        return data.category.name === 'formal'
      }
      else if(filter === '3'){
        return data.category.name === 'casual'
      }
      return false
    }
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort
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
      this.shoes = JSON.parse(localStorage.getItem('shoes'))
      this.dataSource = new MatTableDataSource(this.shoes)
    }
  }

  public onClick() {
    this.router.navigate(['/shoe/add'])
  }

  onSearch(){
     if (this.search !== '' && this.search !== null) {
      this.dataSource.filter = this.search.toLowerCase().trim()
    }
    else {
      this.dataSource = new MatTableDataSource(this.shoes)
    }
  }

  public filterApplied(event: MatRadioChange) {
    this.dataSource.filter = event.value.trim()
  }
}
