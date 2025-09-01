import { Component, OnInit } from '@angular/core';
import { ShoeModel } from '../../../core/models/product/product.model';
import { ProductService } from '../../../core/services/product/product.service';
import { ActivatedRoute } from '@angular/router';
import { NgOptimizedImage, TitleCasePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from '@angular/material/input';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";

@Component({
  selector: 'app-view-shoe-details',
  imports: [TitleCasePipe, NgOptimizedImage, MatButtonModule, MatFormFieldModule, MatInputModule, FormsModule,ReactiveFormsModule],
  templateUrl: './view-shoe-details.component.html',
  styleUrl: './view-shoe-details.component.scss'
})
export class ViewShoeDetailsComponent implements OnInit{
  public shoe : ShoeModel
  public shoeId : number
  public clicked : boolean = false
  public quantForm : FormGroup
  constructor(private productService : ProductService,private route : ActivatedRoute,private fb : FormBuilder){
    this.quantForm = this.fb.group({
      quantity : ['',Validators.required]
    })
  }

  ngOnInit(): void {
    this.shoeId = +this.route.snapshot.paramMap.get('id')
    console.log(this.shoeId);
    const shoes = JSON.parse(localStorage.getItem('shoes'))
    this.shoe = shoes.find((p)=> p.id === this.shoeId)
    console.log(this.shoe);
  }

  public addToCart(){
    this.clicked = true
  }
  
  public onSubmit(){
    
  }
}
