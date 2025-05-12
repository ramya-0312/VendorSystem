import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorResetPasswordComponent } from './vendor-reset-password.component';

describe('VendorResetPasswordComponent', () => {
  let component: VendorResetPasswordComponent;
  let fixture: ComponentFixture<VendorResetPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VendorResetPasswordComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VendorResetPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
