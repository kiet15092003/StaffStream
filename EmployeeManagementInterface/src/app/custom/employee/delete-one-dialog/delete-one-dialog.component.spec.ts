import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteOneDialogComponent } from './delete-one-dialog.component';

describe('DeleteOneDialogComponent', () => {
  let component: DeleteOneDialogComponent;
  let fixture: ComponentFixture<DeleteOneDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteOneDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteOneDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
