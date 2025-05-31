import { Component } from '@angular/core';

@Component({
  standalone:false,
  selector: 'app-vendor-register',
  templateUrl: './vendor-register.component.html',
})
export class VendorRegisterComponent {
  step: number = 1;
  base64Image: string | null = null;
  vendor: any = {
    businessName: '',
    email: '',
    phone: '',
    password: '',
    location: '',
    category: '',
    experience: '',
    description: '',
    base64Image1: '',
    base64Image: '',
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

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        this.base64Image = reader.result as string;
      };

      reader.readAsDataURL(file);
    } else {
      this.base64Image = null;
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
