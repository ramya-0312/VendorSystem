import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  standalone:false,
  selector: 'app-vendor-forgot-password',
  templateUrl: './vendor-forgot-password.component.html',
  styleUrls: ['./vendor-forgot-password.component.css']
})
export class VendorForgotPasswordComponent {
  email = '';
  codeGenerated = false;
  enteredCode = '';
  generatedCode = '';
  isVerified = false;

   constructor(
    private router: Router
  ){}

  generateCode() {
    // Simulate backend-generated code (for now)
    this.generatedCode = Math.floor(100000 + Math.random() * 900000).toString();
    console.log('Generated Code:', this.generatedCode); // Debug
    this.codeGenerated = true;
    alert('Verification code sent to email (simulated)');
  }

  verifyCode() {
    if (this.enteredCode === this.generatedCode) {
      this.isVerified = true;
      this.router.navigate(['/vendor-reset-password']);
    } else {
      alert('Incorrect code. Please try again.');
    }
  }
}
