import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  standalone:false,
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.css']
})
export class UserLoginComponent {
  email = '';
  password = '';
  loginFailed = false;
  responseMessage = '';

  constructor(private http: HttpClient) {}

  login() {
  const payload = {
    email: this.email,
    password: this.password
  };

  this.http.post('https://your-api-url.com/api/user/login', payload).subscribe({
    next: (res: any) => {
      this.loginFailed = false;
      this.responseMessage = res.message || 'Login successful';  
      console.log('Login success:', res);

    },
    error: (err) => {
      this.loginFailed = true;
      this.responseMessage = err.error?.message || 'Login failed. Please try again.';
    }
  });
}
}
