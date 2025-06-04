import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';


@Component({
  standalone:false,
  selector: 'app-vendor-login',
  templateUrl: './vendor-login.component.html',
  styleUrls: ['./vendor-login.component.css']
})
export class VendorLoginComponent {
  email = '';
  password = '';
  loginFailed = false;

  constructor(private http: HttpClient, private router: Router, private toastr: ToastrService) {}

  login() {
    const payload = {
      email: this.email,
      password: this.password
    };
    // Simulate a login request
    // In a real application, you would send this to your backend API
    this.http.post('http://localhost:8080/api/vendor/login', payload).subscribe({
      next: (res: any) => {
        this.loginFailed = false;


        
        const vendorData = {
          fullName: res.response?.fullName,
          email: res.response?.email,
          phone: res.response?.phone,
          location: res.response?.location,
          dob: res.response?.dob,
          profilePicture: res.response?.profilePicture, // Assuming this is a base64 string
          id: res.response.id,
        };

        localStorage.setItem('vendor', JSON.stringify(vendorData));
        this.toastr.success('Login successful!');
        this.router.navigate(['/vendor-dashboard']);
      },
      error: () => {
        this.loginFailed = true;
        this.toastr.error('Login failed! Please check your credentials.');
      }
    });
  }
}
