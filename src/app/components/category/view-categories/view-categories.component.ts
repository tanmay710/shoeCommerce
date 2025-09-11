import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CategoriesService } from '../../../core/services/categories/categories.service';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { TitleCasePipe } from '@angular/common';
import { MatIconModule } from "@angular/material/icon";
import { MatDialog } from '@angular/material/dialog';
import { CategoryAddDialogComponent } from '../category-add-dialog/category-add-dialog.component';
import { ProductCategory } from '../../../core/models/product-category/product.category.model';

@Component({
  selector: 'app-view-categories',
  imports: [MatTableModule, MatButtonModule, MatPaginatorModule, TitleCasePipe, MatIconModule,MatSortModule],
  templateUrl: './view-categories.component.html',
  styleUrl: './view-categories.component.scss'
})
export class ViewCategoriesComponent implements OnInit,AfterViewInit{

  public categories : ProductCategory[]
  public categoryDataSource : MatTableDataSource<ProductCategory> = new MatTableDataSource([])
  public displayedColumns: string[] = ['id', 'name', 'gst', 'actions']

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  
  constructor(private categoriesService : CategoriesService,private dialog : MatDialog){}

  ngOnInit(): void {
    this.categories =   this.categoriesService.getCategories()
    this.categoryDataSource.data = this.categories
  }

  ngAfterViewInit(): void {
    this.categoryDataSource.sort = this.sort
    this.categoryDataSource.paginator = this.paginator
  }

  public onClick(){
    const dialogRef = this.dialog.open(CategoryAddDialogComponent,{data : {mode : 'add'}})
     dialogRef.afterClosed().subscribe((result)=>{
      this.categories =   this.categoriesService.getCategories()
      this.categoryDataSource.data = this.categories
    })
  }

  public onUpdate(category : ProductCategory){
    const dialogref = this.dialog.open(CategoryAddDialogComponent,{data : { category:category, mode : 'update'} })
    dialogref.afterClosed().subscribe((result)=>{
      this.categories =   this.categoriesService.getCategories()
      this.categoryDataSource.data = this.categories
    })
  }
}
