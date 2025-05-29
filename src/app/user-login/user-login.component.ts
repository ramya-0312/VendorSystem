import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
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

  constructor(private http: HttpClient,private router:Router) {}

  login() {
    const payload = {
      email: this.email,
      password: this.password
    };

    this.http.post('http://localhost:8080/api/users/Login'
, payload).subscribe({
      next: (res: any) => {
        this.loginFailed = false;
       
        console.log('Login success:', JSON.stringify(res));
     const userdate=    localStorage.setItem('user', JSON.stringify(res));
        this.router.navigate(['/user-dashboard'])

      },
      error: () => {
        this.loginFailed = true;
      }
    });
  }
}                                                   
