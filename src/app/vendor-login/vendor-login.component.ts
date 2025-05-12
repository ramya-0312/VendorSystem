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
    // Dummy check for now
    if (this.password !== 'correctPassword') {
      this.loginFailed = true;
    } else {
      this.loginFailed = false;
      // Navigate to vendor dashboard or call API
    }
  }
}
