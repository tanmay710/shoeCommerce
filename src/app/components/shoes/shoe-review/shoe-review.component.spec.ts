import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShoeReviewComponent } from './shoe-review.component';

describe('ShoeReviewComponent', () => {
  let component: ShoeReviewComponent;
  let fixture: ComponentFixture<ShoeReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShoeReviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShoeReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
