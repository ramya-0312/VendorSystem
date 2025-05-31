import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  standalone: false,
  selector: 'app-vendor-register',
  templateUrl: './vendor-register.component.html',
})
export class VendorRegisterComponent {
  step: number = 1;

  vendor: any = {
  businessName: '',         // fixed spelling
  email: '',
  phone: '',
  password: '',         // fixed typo
  location: '',
  category: '',
  yearsOfExperience: '',
  servicediscription: '',    // match with backend if that's how your column is spelled
  portfolioBase64: '',             // base64 string (single image)
  certificationImageBase64: '',    // base64 string (single image)
  termsAndCondition: '',     // optional, add if you use this
};

  categories: string[] = ['Photography', 'Catering', 'Decoration', 'Event Planning', 'Music', 'Other'];
  termsText: string = '';
  newReview: string = '';

  constructor(private http: HttpClient) {}

  nextStep(form: any) {
    if (form.valid) this.step++;
  }

  prevStep() {
    this.step--;
  }

  onFileSelected(event: Event, type: 'portfolio' | 'certifications'): void {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) return;

    if (type === 'portfolio') {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.vendor.portfolioBase64 = reader.result as string;
        console.log('Portfolio base64:', this.vendor.portfolioBase64);
      };
      reader.readAsDataURL(file);
    }

    if (type === 'certifications') {
  const file = input.files[0]; // take only one
  const reader = new FileReader();
  reader.onload = () => {
    this.vendor.certificationImageBase64 = reader.result as string;
    console.log('Certification base64:', this.vendor.certificationImageBase64);
  };
  reader.readAsDataURL(file);
}

  }

  registerVendor() {
    console.log("Sending vendor data:", this.vendor);
    console.log(this.vendor.certificationImageBase64)
    console.log(this.vendor.portfolioBase64)
    this.http.post('http://localhost:8080/api/vendor/register', this.vendor).subscribe({
      next: (response) => {
        console.log('Vendor registered successfully:', response);
        alert('Vendor registration successful!');
      },
      error: (error) => {
        console.error('Registration failed:', error);
        alert('Registration failed. Please try again.');
      }
    });
  }
}
