import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppCustomSidenavComponent } from './app-custom-sidenav.component';

describe('AppCustomSidenavComponent', () => {
  let component: AppCustomSidenavComponent;
  let fixture: ComponentFixture<AppCustomSidenavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppCustomSidenavComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppCustomSidenavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
