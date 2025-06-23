import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorBidComponent } from './vendor-bid.component';

describe('VendorBidComponent', () => {
  let component: VendorBidComponent;
  let fixture: ComponentFixture<VendorBidComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VendorBidComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VendorBidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
