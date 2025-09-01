import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewShoeDetailsComponent } from './view-shoe-details.component';

describe('ViewShoeDetailsComponent', () => {
  let component: ViewShoeDetailsComponent;
  let fixture: ComponentFixture<ViewShoeDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewShoeDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewShoeDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
