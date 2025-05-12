import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  standalone:false,
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})
export class UserDashboardComponent {

  constructor(private router: Router) {}

  goTo(path: string) {
    this.router.navigate([`/user-dashboard/${path}`]);
  }

  logout() {
    // Clear session and redirect
    localStorage.clear();
    this.router.navigate(['/user-login']);
  }
}
