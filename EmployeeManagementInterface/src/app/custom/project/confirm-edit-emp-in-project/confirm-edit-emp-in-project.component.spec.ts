import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmEditEmpInProjectComponent } from './confirm-edit-emp-in-project.component';

describe('ConfirmEditEmpInProjectComponent', () => {
  let component: ConfirmEditEmpInProjectComponent;
  let fixture: ComponentFixture<ConfirmEditEmpInProjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmEditEmpInProjectComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmEditEmpInProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
