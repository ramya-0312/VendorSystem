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

  setTab(tab: string) {
    this.activeTab=tab;
  }


  constructor(private router: Router, private toastr: ToastrService, private http: HttpClient) {}

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
