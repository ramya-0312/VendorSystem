import { Component } from '@angular/core';

@Component({
  standalone:false,
  selector: 'app-vendor-register',
  templateUrl: './vendor-register.component.html',
})
export class VendorRegisterComponent {
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
        this.vendor.portfolio.push(file.name); // save file name or file object
      }
    }
  }

  onCertUpload(event: any) {
    const files = event.target.files;
    if (files.length) {
      for (let file of files) {
        this.vendor.certifications.push(file.name); // save file name or file object
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
    console.log('Vendor submitted:', this.vendor);
    // API call here
  }
}
