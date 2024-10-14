import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmOutProjectComponent } from './confirm-out-project.component';

describe('ConfirmOutProjectComponent', () => {
  let component: ConfirmOutProjectComponent;
  let fixture: ComponentFixture<ConfirmOutProjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmOutProjectComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmOutProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
