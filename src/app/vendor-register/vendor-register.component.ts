import { Component } from '@angular/core';

@Component({
  standalone:false,
  selector: 'app-vendor-register',
  templateUrl: './vendor-register.component.html',
  styleUrls: ['./vendor-register.component.css']
})
export class VendorRegisterComponent {
  vendor = {
    company: '',
    address: '',
    category: '',
    photoWork: '',
    gstNo: '',
    website: '',
    phone: '',
    email: '',
    password: ''
  };

  confirmPassword = '';
  passwordMismatch = false;

  register() {
    this.passwordMismatch = this.vendor.password !== this.confirmPassword;
    if (!this.passwordMismatch) {
      console.log('Registered Vendor:', this.vendor);
      // Call backend API here
    }
  }
}
