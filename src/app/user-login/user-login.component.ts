import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  standalone: false,
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.css']
})
export class UserLoginComponent {
  email = '';
  password = '';
  loginFailed = false;
  responseMessage = '';

  constructor(private http: HttpClient, private router: Router) {}

  login() {
    const payload = {
      email: this.email,
      password: this.password
    };

    this.http.post('http://localhost:8080/api/users/Login', payload).subscribe({
      next: (res: any) => {
        this.loginFailed = false;

        const base64 = res.response?.profilePicture;

        // ✅ Check base64 size before saving
        const MAX_ALLOWED_SIZE = 4000000; // ~4MB
        if (base64 && base64.length < MAX_ALLOWED_SIZE) {
          const userData = {
            fullName: res.response?.fullName,
            email: res.response?.email,
            phone: res.response?.phone,
            location: res.response?.location,
            dob: res.response?.dob,
            profilePicture: base64 ,// 👈 include only if small enough
            id:res.response.id,
          };

          localStorage.setItem('user', JSON.stringify(userData));
        } else {
          alert('Profile picture too large to store in localStorage!');
        }

        this.router.navigate(['/user-dashboard']);
      },
      error: () => {
        this.loginFailed = true;
      }
    });
  }
}
