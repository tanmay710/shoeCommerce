import { Component, Inject, model, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { StarRatingModule } from 'angular-star-rating';
import { NgxStarRatingModule } from 'ngx-star-rating';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { ReviewService } from '../../core/services/review/review.service';
import { UserModel } from '../../core/models/user/user.model';
import { ReviewModel } from '../../core/models/review/review';

@Component({
  selector: 'app-review-dialog',
  imports: [ReactiveFormsModule, MatButtonModule, MatSelectModule, MatInputModule,
    MatFormFieldModule, FormsModule,  MatDialogContent, MatDialogTitle,
    StarRatingModule,NgxStarRatingModule
  ],
  templateUrl: './review-dialog.component.html',
  styleUrl: './review-dialog.component.scss'
})
export class ReviewDialogComponent implements OnInit {
  public reviewForm: FormGroup
 
  public selectedRating: number | null = null
  public productId: number
  public mode: string
  public user: UserModel
  public existingReview : ReviewModel
  
  constructor(private fb: FormBuilder,
    private dialogRef: MatDialogRef<ReviewDialogComponent>, private reviewService: ReviewService,
    @Inject(MAT_DIALOG_DATA) public data: { productId: number, mode: string,existingReview : ReviewModel }
  ) {
    
    this.productId = data.productId
    this.reviewForm = this.fb.group({
      rating: ['', Validators.required],
      comment: ['', Validators.required]
    })
    this.mode = data.mode
    this.existingReview = data.existingReview
  }

  ngOnInit(): void {
    let currentUser: UserModel = JSON.parse(localStorage.getItem('userLoggedIn'))
    this.user = currentUser
    if(this.mode === 'update'){
      this.reviewForm.patchValue(this.existingReview)
    }
  }

  public onSubmit() {
    if (this.reviewForm.valid) {
      if (this.mode === 'add') {
        const allReviews = this.reviewService.getAllReviews()
        let lastReview = allReviews[allReviews.length - 1]
        let lastId: number
        if (lastReview) {
          lastId = lastReview.id
        }
        else {
          lastId = 0
        }
        let newDate = new Date()
        let newReview: ReviewModel = {
          id: lastId + 1,
          rating: this.reviewForm.value.rating,
          comment: this.reviewForm.value.comment,
          productId: this.productId,
          userId: this.user.id,
          date: newDate.toLocaleString(),
          userName: this.user.name
        }
        this.reviewService.addReview(newReview)
        this.dialogRef.close()
        alert("Successfully added a review")
      }
      else{
        let updatedReview : ReviewModel ={
          id: this.existingReview.id,
          rating: this.reviewForm.value.rating,
          comment: this.reviewForm.value.comment,
          productId: this.existingReview.productId,
          userId: this.existingReview.userId,
          userName: this.existingReview.userName,
          date: this.existingReview.date
        }
        this.reviewService.updateReview(updatedReview)
        alert("Successfully updated your review")
        this.dialogRef.close()
      }
    }
  }

  public onClose() {
    this.dialogRef.close()
  }
}
