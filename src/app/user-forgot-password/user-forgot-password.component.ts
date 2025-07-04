import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  standalone:false,
  selector: 'app-user-forgot-password',
  templateUrl: './user-forgot-password.component.html',
  styleUrls: ['./user-forgot-password.component.css']
})
export class UserForgotPasswordComponent {
  email = '';
  codeGenerated = false;
  enteredCode = '';
  generatedCode = '';
  isVerified = false;
  constructor(
    private router: Router,
    private http: HttpClient
  ){}

  generateCode() {
    this.generatedCode = Math.floor(100000 + Math.random() * 900000).toString();
    console.log('Generated Code:', this.generatedCode);
    this.codeGenerated = true;
    alert('Verification code sent to your email (simulated)');
  }

  verifyCode() {
    this.http.post('http://localhost:8080/api/users/verifyCode', { email: this.email, code: this.enteredCode }).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.isVerified = true;
          this.router.navigate(['/user-reset-password']);
        } else {
          alert('Invalid code. Please try again.');
        }
      },
      error: () => {
        alert('Error verifying code. Please try again later.');
      }
    });
    }
  }

