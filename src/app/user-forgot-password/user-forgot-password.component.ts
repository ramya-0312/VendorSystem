import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  standalone: false,
  selector: 'app-user-forgot-password',
  templateUrl: './user-forgot-password.component.html',
  styleUrls: ['./user-forgot-password.component.css']
})
export class UserForgotPasswordComponent {
  email: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  isVerified: boolean = false;
  emailInvalid: boolean = false;
  passwordMismatch: boolean = false;
  passwordResetSuccess: boolean = false;

  constructor(private http: HttpClient, private toastr: ToastrService, private router: Router) {}

  verifyEmail() {
    this.http.post('/api/user/verify-email', { email: this.email }).subscribe(
      (res: any) => {
        if (res.exists) {
          this.isVerified = true;
          this.emailInvalid = false;
        } else {
          this.emailInvalid = true;
        }
      },
      (err) => {
        this.emailInvalid = true;
      }
    );
  }

  resetPassword() {
    if (this.newPassword !== this.confirmPassword) {
      this.passwordMismatch = true;
      return;
    }

    this.passwordMismatch = false;

    this.http.post('/api/user/reset-password', {
      email: this.email,
      newPassword: this.newPassword,
    }).subscribe(
      (res) => {
        this.toastr.success('Password reset successfully');
        this.passwordResetSuccess = true;
        setTimeout(() => {
          this.router.navigate(['/user-login']);
        }, 2000);
      },
      (err) => {
        console.error('Error resetting password', err);
      }
    );
  }
}
