import { Component } from '@angular/core';

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

  login() {

    if (this.password !== 'correctPassword') {
      this.loginFailed = true;
    } else {
      this.loginFailed = false;
      console.log('Login successful for:', this.email);

    }
  }
}
