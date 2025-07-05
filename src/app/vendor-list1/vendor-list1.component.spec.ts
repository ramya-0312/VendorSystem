import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorList1Component } from './vendor-list1.component';

describe('VendorList1Component', () => {
  let component: VendorList1Component;
  let fixture: ComponentFixture<VendorList1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VendorList1Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VendorList1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
