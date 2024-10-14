import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuccessDeleteEmployeeSnackbarComponent } from './success-delete-employee-snackbar.component';

describe('SuccessDeleteEmployeeSnackbarComponent', () => {
  let component: SuccessDeleteEmployeeSnackbarComponent;
  let fixture: ComponentFixture<SuccessDeleteEmployeeSnackbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuccessDeleteEmployeeSnackbarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuccessDeleteEmployeeSnackbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
