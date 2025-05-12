import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  standalone:false,
  selector: 'app-user-reset-password',
  templateUrl: './user-reset-password.component.html',
  styleUrls: ['./user-reset-password.component.css']
})
export class UserResetPasswordComponent {
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
    this.router.navigate(['/user-login']);
  }
}
