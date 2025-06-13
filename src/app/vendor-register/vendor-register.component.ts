import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  standalone: false,
  selector: 'app-vendor-register',
  templateUrl: './vendor-register.component.html',
})
export class VendorRegisterComponent {
  step: number = 1;

  constructor(private http: HttpClient, private toastr: ToastrService, private router: Router) {}

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
  certificationImageBase64: '',
  photoWorksbase64: [],  // base64 string (single image)
  termsAndCondition: '',

};

  categories: string[] = ['Photography', 'Catering', 'Decoration', 'Event Planning', 'Music', 'Other'];
  termsText: string = '';
  newReview: string = '';

  //constructor(private http: HttpClient) {}

  removeImage(type: 'photoWorks' | 'certifications', index: number) {
  this.vendor[type].splice(index, 1);
}


  nextStep(form: any) {
    if (form.valid) this.step++;
  }

  prevStep() {
    this.step--;
  }

  onFileSelected(event: Event, type: 'portfolio' | 'certifications' | 'photoWorks'): void {
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
        this.toastr.success('Vendor registration successful!');
        this.router.navigate(['/vendor-login']);
        //alert('Vendor registration successful!');
      },
      error: (error) => {
        console.error('Registration failed:', error);
        this.toastr.error('Registration failed. Please try again.');
        //alert('Registration failed. Please try again.');
      }
    });
  }
}
