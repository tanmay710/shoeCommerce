import { Injectable } from '@angular/core';
import { ReviewModel } from '../../models/review/review';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {

  constructor() { }

  public getAllReviews(){
    let allReviews:ReviewModel[] = JSON.parse(localStorage.getItem('review')) || []
    return allReviews
  }

  public addReview(review : ReviewModel){
    let reviews = this.getAllReviews()
    reviews.push(review)
    localStorage.setItem('review',JSON.stringify(reviews))
  }

  public updateReview(review : ReviewModel){
    let reviews : ReviewModel[] = this.getAllReviews()
    let currReviewIndex :number= reviews.findIndex((p)=> p.id === review.id)
    reviews[currReviewIndex] = {...review}
    localStorage.setItem('review',JSON.stringify(reviews))
  }

  public deleteReview(review : ReviewModel){
    let reviews : ReviewModel[] = this.getAllReviews()
    let filteredReviews = reviews.filter((p)=> p.id !== review.id)
    localStorage.setItem('review',JSON.stringify(filteredReviews))
  }
}
