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

  constructor(private http: HttpClient) {}

  login() {
    const payload = {
      email: this.email,
      password: this.password
    };

    this.http.post('https://your-api-url.com/api/user/login', payload).subscribe({
      next: (res: any) => {
        this.loginFailed = false;

        console.log('Login success:', res);
      },
      error: () => {
        this.loginFailed = true;
      }
    });
  }
}                                                   
