import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  standalone:false,
  selector: 'app-vendor-reset-password',
  templateUrl: './vendor-reset-password.component.html',
  styleUrls: ['./vendor-reset-password.component.css']
})
export class VendorResetPasswordComponent {
  email = '';
  newPassword = '';
  confirmPassword = '';
  isLoading = false;

  constructor(private router: Router, private http: HttpClient) {}

  resetPassword() {
    if (this.newPassword !== this.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    // if (!this.email || !this.newPassword) {
    //   alert('Please fill in all fields');
    //   return;
    // }

    this.isLoading = true;

    // API payload with email and password
    const payload = {
      email: this.email,
      password: this.newPassword
    };

    // Replace with your actual API URL
    const apiUrl = 'http://localhost:8080/api/vendor/restpassword';

    this.http.post(apiUrl, payload).subscribe({
      next: (response) => {
        this.isLoading = false;
        alert('Password reset successfully!');
        this.router.navigate(['/vendor-login']);
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error resetting password:', error);
        alert('Failed to reset password. Please try again.');
      }
    });
  }
}
