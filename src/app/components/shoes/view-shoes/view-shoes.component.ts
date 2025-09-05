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
import { MatRadioModule } from '@angular/material/radio';
import { ShoeCategory } from '../../../core/models/product-category/product.category.model';
import { CategoriesService } from '../../../core/services/categories/categories.service';
import { MatInputModule } from '@angular/material/input';
import { MatSelect, MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';

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
  public dataSource: MatTableDataSource<ShoeModel>
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
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('myMatSelect') myMatSelect: MatSelect;
  constructor(private productService: ProductService, private router: Router, private categoriesService: CategoriesService) { }

  ngOnInit(): void {
    this.shoes = this.productService.getShoes()
    this.filteredDataSource = this.shoes
    this.searchDataSource = this.shoes
    this.dataSource = new MatTableDataSource(this.shoes)
    this.categories = this.categoriesService.getCategories()
    this.displayDropDown = [...this.categories]
    this.dataSource.filterPredicate = (data: ShoeModel, filter: string) => {
      const filterObj: MyFilters = JSON.parse(filter);
      const nameMatch = data.name.toLowerCase().includes(filterObj.nameSearch)
      const categoryMatch = filterObj.categoryName === '' || data.category.name.toLowerCase() === filterObj.categoryName.toLowerCase()
      return nameMatch && categoryMatch
    }
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort
    this.dataSource.paginator = this.paginator;
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

  public applyFilter(){
    let tempData : ShoeModel[] = [...this.shoes]
      tempData = this.shoes.filter((p)=> p.name.toLowerCase().trim().includes(this.search.toLowerCase().trim()))
      if(this.selectedCategory && this.selectedCategory !== 'none'){
       tempData = tempData.filter((p)=> p.category.name === this.selectedCategory)
      }
      if(this.selectedStatus && this.selectedStatus !== 'all'){
        if(this.selectedStatus === 'instock'){
          tempData = tempData.filter((p)=> p.inventory > 0)
        }
        else{
          tempData = tempData.filter((p)=> p.inventory === 0)
        }
      }
      this.dataSource = new MatTableDataSource(tempData)
      this.dataSource.sort = this.sort
      this.dataSource.paginator = this.paginator;
  }

  // public onSearch() {
  //   this.filterObject.nameSearch= this.search.toLowerCase().trim() || ''
  //   this.dataSource.filter = JSON.stringify(this.filterObject)
  //   if (this.selectedCategory !== 'none') {
  //     console.log(this.selectedCategory);
  //     this.searchDataSource = this.filteredDataSource.filter((p) => p.name.toLowerCase().trim().includes(this.search.toLowerCase().trim()))
  //     this.dataSource = new MatTableDataSource(this.searchDataSource)
  //   }
  //   else {
  //     this.searchDataSource = this.shoes.filter((p) => p.name.toLowerCase().trim().includes(this.search.toLowerCase().trim()))
  //     this.dataSource = new MatTableDataSource(this.searchDataSource)
  //   }
  // }


  // public selectChange(event: MatSelectChange) {
    
  //   this.search = ''
  //   this.selectedCategory = event.value?.toLowerCase()
  //   let category = event.value?.toLowerCase()
    

  //   if(this.selectedStatus && this.selectedStatus !== 'all'){

  //     if (this.selectedStatus === 'instock') {
  //       this.stockDataSource = this.shoes.filter((p) => p.inventory > 0)
       
  //     }
  //     else if (this.selectedStatus === 'outofstock') {
  //       this.stockDataSource = this.shoes.filter((p) => p.inventory === 0)
  //     }

  //     if (category && category !== 'none') {
  //       this.filteredDataSource = this.stockDataSource.filter((p) => p.category.name === category)
  //       this.dataSource = new MatTableDataSource(this.filteredDataSource)
  //     }
  //     else {
  //       this.dataSource = new MatTableDataSource(this.stockDataSource)
  //     }
  //   }
  //   else{
  //     if (category && category !== 'none') {
  //       this.filteredDataSource = this.shoes.filter((p) => p.category.name === category)
  //       this.dataSource = new MatTableDataSource(this.filteredDataSource)
  //     }
  //     else {
  //       this.dataSource = new MatTableDataSource(this.shoes)
  //     }
  //   }

  //   this.filterObject.categoryName = event.value?.toLowerCase()==='none'?'': event.value?.toLowerCase()
  //   this.dataSource.filter = JSON.stringify(this.filterObject)
  // }

  // public stockChange(event: MatSelectChange) {
    
  //   this.selectedStatus = event.value
  //   this.search = ''
    
    
  //   if (this.selectedCategory && this.selectedCategory !== 'none') {
      
  //     this.filteredDataSource = this.shoes.filter((p)=> p.category.name === this.selectedCategory)
      
  //     if (this.selectedStatus === 'instock') {
  //       this.stockDataSource = this.filteredDataSource.filter((p) => p.inventory > 0)
  //       this.dataSource = new MatTableDataSource(this.stockDataSource)
  //     }
  //     else if (this.selectedStatus === 'outofstock') {
  //       this.stockDataSource = this.filteredDataSource.filter((p) => p.inventory === 0)
  //       this.dataSource = new MatTableDataSource(this.stockDataSource)
  //     }
  //     else {
  //       this.dataSource = new MatTableDataSource(this.filteredDataSource)
  //     }
  //   }

  //   else {
      
      
  //     if (this.selectedStatus === 'instock') {
  //       this.stockDataSource = this.shoes.filter((p) => p.inventory > 0)
  //       this.dataSource = new MatTableDataSource(this.stockDataSource)
  //     }
  //     else if (this.selectedStatus === 'outofstock') {
  //       this.stockDataSource = this.shoes.filter((p) => p.inventory === 0)
  //       this.dataSource = new MatTableDataSource(this.stockDataSource)
  //     }
  //     else {
  //       this.dataSource = new MatTableDataSource(this.shoes)
  //     }
  //   }
  // }
}

interface DropDown {
  id: number
  name: string
}

interface MyFilters {
  nameSearch: string
  categoryName: string
}