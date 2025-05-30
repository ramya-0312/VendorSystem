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

  selectedFile: File | null = null;
  isUploading = false;

  constructor(private http: HttpClient) {}

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  async uploadImageToCloudinary(): Promise<string> {
    const formData = new FormData();
    formData.append('file', this.selectedFile!);
    formData.append('upload_preset', 'unsigned_preset');

    const cloudinaryUrl = 'https://api.cloudinary.com/v1_1/dzeuguhec/image/upload'; 
    try {
      this.isUploading = true;
      const response: any = await this.http.post(cloudinaryUrl, formData).toPromise();
      this.isUploading = false;
      return response.secure_url;
    } catch (error) {
      this.isUploading = false;
      console.error('Image upload failed:', error);
      throw error;
    }
  }

  async register() {
    if (this.user.password !== this.user.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    if (!this.selectedFile) {
      alert('Please select a profile picture');
      return;
    }

    try {
      const imageUrl = await this.uploadImageToCloudinary();
      this.user.profilePic = imageUrl;


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

    } catch (error) {
      alert('Image upload failed. Please try again.');
    }
  }
}
