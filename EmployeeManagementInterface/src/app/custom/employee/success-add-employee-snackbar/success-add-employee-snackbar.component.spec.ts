import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuccessAddEmployeeSnackbarComponent } from './success-add-employee-snackbar.component';

describe('SuccessAddEmployeeSnackbarComponent', () => {
  let component: SuccessAddEmployeeSnackbarComponent;
  let fixture: ComponentFixture<SuccessAddEmployeeSnackbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuccessAddEmployeeSnackbarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuccessAddEmployeeSnackbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
