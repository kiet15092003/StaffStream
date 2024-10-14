import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddToProjectComponent } from './add-to-project.component';

describe('AddToProjectComponent', () => {
  let component: AddToProjectComponent;
  let fixture: ComponentFixture<AddToProjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddToProjectComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddToProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
