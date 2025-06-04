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
    fullName: '',
    dob: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    location: '',
    profilePicture: ''
  };

  previewUrl: string = '';
  isUploading = false;

  constructor(private http: HttpClient) {}

  // Format DOB to yyyy/mm/dd
  private formatDOB(): string {
    const date = new Date(this.user.dob);
    const year = date.getFullYear().toString();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}/${month}/${day}`;
  }

  // Handle profile picture file selection
  onFileSelected(event: any): void {
  const file = event.target.files[0];

  if (!file) return;

  const maxSizeInMB = 3;
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;

  // ✅ File size check
  if (file.size > maxSizeInBytes) {
    alert(`File is too large. Maximum size allowed is ${maxSizeInMB} MB.`);
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    this.user.profilePicture = reader.result as string;
    this.previewUrl = reader.result as string;
    console.log('Profile Pic base64:', this.user.profilePicture); // fixed typo: ProfilePicture → profilePicture
  };
  reader.readAsDataURL(file);
}


  // Register user
  register(): void {
    if (this.user.password !== this.user.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    if (!this.user.profilePicture) {
      alert('Please upload a profile picture!');
      return;
    }

    const formattedUser = {
      ...this.user,
      dob: this.formatDOB()  // Replace dob with formatted one
    };

    const apiUrl = 'http://localhost:8080/api/users/register';

    this.http.post(apiUrl, formattedUser).subscribe({
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
