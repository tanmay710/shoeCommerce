import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartUpdateDialogComponent } from './cart-update-dialog.component';

describe('CartUpdateDialogComponent', () => {
  let component: CartUpdateDialogComponent;
  let fixture: ComponentFixture<CartUpdateDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CartUpdateDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CartUpdateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
