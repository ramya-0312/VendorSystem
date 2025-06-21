import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';

@Component({
  standalone:false,
  selector: 'app-vendor-dashboard',
  templateUrl: './vendor-dashboard.component.html',
  styleUrls: ['./vendor-dashboard.component.css']
})
export class VendorDashboardComponent {
  activeTab = 'message';
  activaTab='update-profile';
  unreadCount: number = 0;
  notifications: any[] = [];
  userEmail: string = '';


  setTab(tab: string) {
    this.activeTab=tab;
  }


  constructor(private router: Router, private toastr: ToastrService, private http: HttpClient) {}

  ngOnInit() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  this.userEmail = user.email;

  this.fetchNotifications();
}

fetchNotifications() {
  this.http.get<any[]>(`http://localhost:8080/api/notifications/${this.userEmail}`).subscribe(data => {
    this.notifications = data.filter(n => !n.status || n.status !== 'leave');
    this.unreadCount = this.notifications.length;
  });
}

markAsLeft(notificationId: number) {
  this.http.post(`http://localhost:8080/api/notifications/leave/${notificationId}`, {}).subscribe(() => {
    this.fetchNotifications();
  });
}

openChatFromNotification(vendorEmail: string) {
  
  localStorage.setItem('chatVendorEmail', vendorEmail);
  this.activeTab = 'chat';
}

  goTo(path: string) {
    this.router.navigate([`/vendor-dashboard/${path}`]);
  }

  switchToChatTab(){
    this.activeTab = 'message';
  }

  logout() {

  }
  confirmLogout(): void {
   // Clear session and redirect
    localStorage.clear();
    this.router.navigate(['/vendor-login']);
  }
}
