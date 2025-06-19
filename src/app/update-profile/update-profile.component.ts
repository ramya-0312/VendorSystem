import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  standalone: false,
  selector: 'app-update-profile',
  templateUrl: './update-profile.component.html',
  styleUrls: ['./update-profile.component.css']
})
export class UpdateProfileComponent {
  
  user: any = {
    id: '',
    fullName: '',
    dob: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    location: '',
    profilePicture: '',
    
  };

  previewUrl: string = '';
  isUploading = false;
ngOnInit(): void {
    const userString = localStorage.getItem("user");
    if (userString !== null) {
      const userData = JSON.parse(userString);
      this.user.id = userData.id;}else {
      console.error("User data not found in localStorage");
    }}

  constructor(private http: HttpClient,private router:Router,private toastr :ToastrService) {}

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
//  let anser=console.log(localStorage.getItem("user"))
const userString = localStorage.getItem("user");

if (userString !== null) {
  const userData = JSON.parse(userString);
  const userId = userData.id;
  console.log(userId); // Use userId as needed
} else {
  console.error("User data not found in localStorage");
}

// console.log(userId); 
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
      //alert('Passwords do not match!');
      this.toastr.error('Passwords do not match!');
      return;
    }

    if (!this.user.profilePicture) {
      //alert('Please upload a profile picture!');
      this.toastr.warning('Please upload a profile picture!');
      return;
    }

    const formattedUser = {
      ...this.user,
      dob: null,
      password:null,
      confirmPassword:null,
     


    };

    const apiUrl = 'http://localhost:8080/api/users/updated';

    this.http.post(apiUrl, formattedUser).subscribe({
      next: (res) => {
        console.log('User registered:', res);
       // alert('User Registered Successfully!');
        this.toastr.success('Profile Updated Successfully!');
        this.router.navigate(['/user-dashboard']);

      },
      error: (err) => {
        console.error('Registration failed:', err);
       // alert('Registration failed. Please try again.');
        this.toastr.error('Update failed. Please try again.');
      }
    });
  }
}
