import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { NgxStarsModule } from 'ngx-stars';
import { ReviewShowModel } from '../../../core/models/review/review-show';
import { DatePipe } from '@angular/common';
import { MatIconModule } from "@angular/material/icon";
import { ReviewModel } from '../../../core/models/review/review';
import { UserModel } from '../../../core/models/user/user.model';
import { ReviewDialogComponent } from '../../review-dialog/review-dialog.component';
import { ReviewService } from '../../../core/services/review/review.service';
import { MatDialog } from '@angular/material/dialog';
import { UserService } from '../../../core/services/user/user.service';

@Component({
  selector: 'app-shoe-review',
  imports: [NgxStarsModule, MatCardModule, DatePipe, MatIconModule],
  templateUrl: './shoe-review.component.html',
  styleUrl: './shoe-review.component.scss'
})
export class ShoeReviewComponent {

  @Input() public productReviews: ReviewShowModel[]
  @Input() public productId : number
  @Input() public userId : number
  constructor(private reviewService : ReviewService,private dialog : MatDialog,private userService : UserService){}

   public onEdit(review: ReviewModel) {
      const dialogref = this.dialog.open(ReviewDialogComponent, { data: { productId: this.productId, mode: 'update', existingReview: review } })
      dialogref.afterClosed().subscribe(result => {
        let allReviews = this.reviewService.getAllReviews()
        let thisShoeReviews = allReviews.filter((p) => p.productId === this.productId)
        this.productReviews = thisShoeReviews.map((p) => {
          let users: UserModel[]
          this.userService.getUsers().subscribe((data) => {
            users = data
          })
          let user: UserModel = users.find((u) => p.userId === u.id)
          return {
            id: p.id,
            rating: p.rating,
            comment: p.comment,
            productId: p.productId,
            userId: p.userId,
            userName: user.name,
            date: p.date
          }
        }
        )
      })
    }
    public onDelete(review: ReviewModel) {
    const confirmation = confirm("Are you sure you want to delete this review")
    if (confirmation) {
      this.reviewService.deleteReview(review)
      let allReviews = this.reviewService.getAllReviews()
      let thisShoeReviews = allReviews.filter((p) => p.productId === this.productId)
      this.productReviews = thisShoeReviews.map((p) => {
      let users : UserModel[]  
      this.userService.getUsers().subscribe((data)=>{
        users = data
      })
      let user : UserModel = users.find((u)=> p.userId === u.id)
      return {
        id: p.id,
        rating: p.rating,
        comment: p.comment,
        productId: p.productId,
        userId: p.userId,
        userName: user.name,
        date: p.date
      }
    }
    )
    }
  }
}
