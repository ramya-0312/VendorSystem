import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

@Component({
  standalone:false,
  selector: 'app-vendor-forgot-password',
  templateUrl: './vendor-forgot-password.component.html',
  styleUrls: ['./vendor-forgot-password.component.css']
})
export class VendorForgotPasswordComponent {
  email: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  isVerified: boolean = false;
  emailInvalid: boolean = false;
  passwordMismatch: boolean = false;
  passwordResetSuccess: boolean = false;

   constructor(
    private router: Router,private http: HttpClient,private toastr: ToastrService
  ){}

  verifyEmail() {
  this.http.post('/api/verify-email', { email: this.email }).subscribe(
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

  this.http.post('/api/reset-password', {
    email: this.email,
    newPassword: this.newPassword,
  }).subscribe(
    (res) => {
      this.passwordResetSuccess = true;
      setTimeout(() => {
        this.toastr.success('Password reset successfully');
        this.router.navigate(['/vendor-login']);
      }, 2000);
    },
    (err) => {
      console.error('Error resetting password', err);
    }
  );
}
}
