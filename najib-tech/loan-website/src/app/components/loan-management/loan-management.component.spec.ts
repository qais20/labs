import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanManagementComponent } from './loan-management.component';

describe('LoanManagementComponent', () => {
  let component: LoanManagementComponent;
  let fixture: ComponentFixture<LoanManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoanManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoanManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
