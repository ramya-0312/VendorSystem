import { Component } from '@angular/core';

@Component({
  standalone:false,
  selector: 'app-user-register',
  templateUrl: './user-register.component.html',
  styleUrls: ['./user-register.component.css']
})
export class UserRegisterComponent {
  user = {
    name: '',
    dob: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: ''
  };

  register() {
    if (this.user.password !== this.user.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    console.log('User Registered:', this.user);
    alert('User Registered Successfully!');
    // Backend API call can be added here
  }
}
