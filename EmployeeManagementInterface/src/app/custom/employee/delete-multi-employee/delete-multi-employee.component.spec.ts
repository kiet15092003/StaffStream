import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteMultiEmployeeComponent } from './delete-multi-employee.component';

describe('DeleteMultiEmployeeComponent', () => {
  let component: DeleteMultiEmployeeComponent;
  let fixture: ComponentFixture<DeleteMultiEmployeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteMultiEmployeeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteMultiEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
