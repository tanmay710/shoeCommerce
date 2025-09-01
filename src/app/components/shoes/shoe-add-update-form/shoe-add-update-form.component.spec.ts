import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShoeAddUpdateFormComponent } from './shoe-add-update-form.component';

describe('ShoeAddUpdateFormComponent', () => {
  let component: ShoeAddUpdateFormComponent;
  let fixture: ComponentFixture<ShoeAddUpdateFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShoeAddUpdateFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShoeAddUpdateFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
