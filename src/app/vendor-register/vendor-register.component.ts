import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  standalone: false,
  selector: 'app-vendor-register',
  templateUrl: './vendor-register.component.html',
})
export class VendorRegisterComponent {
  constructor(private http: HttpClient) {}

  step: number = 1;

  vendor: any = {
    businessName: '',
    email: '',
    phone: '',
    password: '',
    location: '',
    category: '',
    experience: '',
    description: '',
    certifications: [],
    portfolio: [],
    reviews: [],
  };

  categories: string[] = ['Photography', 'Catering', 'Decoration', 'Event Planning', 'Music', 'Other'];
  newReview: string = '';
  termsText: string = ``;

  nextStep(form: any) {
    if (form.valid) this.step++;
  }

  prevStep() {
    this.step--;
  }

  onPortfolioSelected(event: any) {
    const files = event.target.files;
    if (files.length) {
      for (let file of files) {
        this.vendor.portfolio.push(file.name);
      }
    }
  }

  onCertUpload(event: any) {
    const files = event.target.files;
    if (files.length) {
      for (let file of files) {
        this.vendor.certifications.push(file.name);
      }
    }
  }

  addReview() {
    if (this.newReview.trim()) {
      this.vendor.reviews.push(this.newReview.trim());
      this.newReview = '';
    }
  }

  registerVendor() {
    this.http.post('http://localhost:8080/api/vendors/register', this.vendor).subscribe({
      next: (response) => {
        console.log('Vendor registered successfully:', response);
        alert('Vendor registration successful!');

      },
      error: (error) => {
        console.error('Vendor registration failed:', error);
        alert('Registration failed. Please try again.');
      }
    });
  }
}
