import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  standalone: false,
  selector: 'app-user-register',
  templateUrl: './user-register.component.html',
  styleUrls: ['./user-register.component.css']
})
export class UserRegisterComponent {
  user: any = {
    name: '',
    dob: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    location: '',
    profilePic: ''
  };

  previewUrl: string = '';
  isUploading = false;

  constructor(private http: HttpClient) {}

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.user.profilePic = reader.result as string; 
        this.previewUrl = reader.result as string;
        console.log('Profile Pic base64:', this.user.profilePic);
      };
      reader.readAsDataURL(file);
    }
  }

  register(): void {
    if (this.user.password !== this.user.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    if (!this.user.profilePic) {
      alert('Please upload a profile picture!');
      return;
    }

    const apiUrl = 'http://localhost:8080/api/user/register';

    this.http.post(apiUrl, this.user).subscribe({
      next: (res) => {
        console.log('User registered:', res);
        alert('User Registered Successfully!');
      },
      error: (err) => {
        console.error('Registration failed:', err);
        alert('Registration failed. Please try again.');
      }
    });
  }
}
