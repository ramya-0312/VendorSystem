import { Component } from '@angular/core';

@Component({
  selector: 'app-user-login',
  standalone: false,
  templateUrl: './user-login.component.html',
  styleUrl: './user-login.component.css'
})
export class UserLoginComponent {
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
