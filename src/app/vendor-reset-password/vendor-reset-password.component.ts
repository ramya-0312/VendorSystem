import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  standalone:false,
  selector: 'app-vendor-reset-password',
  templateUrl: './vendor-reset-password.component.html',
  styleUrls: ['./vendor-reset-password.component.css']
})
export class VendorResetPasswordComponent {
  newPassword = '';
  confirmPassword = '';

  constructor(private router: Router) {}

  resetPassword() {
    if (this.newPassword !== this.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    // Send new password to backend API
    alert('Password reset successfully!');
    this.router.navigate(['/vendor-login']);
  }
}
