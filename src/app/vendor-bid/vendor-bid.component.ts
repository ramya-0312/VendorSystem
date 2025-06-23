import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

@Component({
  standalone: false,
  selector: 'app-vendor-bid',
  templateUrl: './vendor-bid.component.html',
  styleUrls: ['./vendor-bid.component.css']
})
export class VendorBidComponent implements OnInit {
  categories = ['Photography', 'Catering', 'Decoration', 'Music', 'Makeup'];
  selectedCategory = '';
  message = '';
  name = '';
  email = '';
  mobile = '';
  city = '';
  date = '';
  startTime = '';
  endTime = '';
  allTimes: string[] = [];
  filteredEndTimes: string[] = [];
  vendorId: string = '';

  constructor(private http: HttpClient, private toastr: ToastrService) {}

  ngOnInit(): void {
    this.generateTimeSlots();
    const vendor = JSON.parse(localStorage.getItem('vendor') || '{}');
  this.vendorId = vendor.id
  }

  onCategoryChange(event: any): void {
    this.selectedCategory = event.target.value;
  }

  generateTimeSlots(): void {
    const times = [];
    for (let h = 0; h < 24; h++) {
      for (let m = 0; m < 60; m += 30) {
        const hour = h.toString().padStart(2, '0');
        const minute = m.toString().padStart(2, '0');
        times.push(`${hour}:${minute}`);
      }
    }
    this.allTimes = times;
  }

  updateEndTimes(): void {
    if (!this.startTime) {
      this.filteredEndTimes = [];
      return;
    }

    const [startHour, startMinute] = this.startTime.split(':').map(Number);
    const startTotalMinutes = startHour * 60 + startMinute;

    this.filteredEndTimes = this.allTimes.filter(time => {
      const [hour, minute] = time.split(':').map(Number);
      const totalMinutes = hour * 60 + minute;
      return totalMinutes >= startTotalMinutes + 180; // 3+ hours
    });

    if (!this.filteredEndTimes.includes(this.endTime)) {
      this.endTime = '';
    }
  }

  sendBid(): void {
    if (
      this.name && this.email && this.mobile && this.city &&
      this.date && this.startTime && this.endTime &&
      this.selectedCategory && this.message
    ) {
      const payload = {
      name: this.name,
      email: this.email,
      mobile: this.mobile,
      city: this.city,
      date: this.date,
      startTime: this.startTime,
      endTime: this.endTime,
      category: this.selectedCategory,
      message: this.message,
      status: "null",
      vendor_id: this.vendorId
};


      this.http.post('http://localhost:8080/notification/sentbid', payload)
        .subscribe({
          next: (res: any) => {
            this.toastr.success(res.response || 'Bid sent successfully!');
            // Reset form
            this.name = '';
            this.email = '';
            this.mobile = '';
            this.city = '';
            this.date = '';
            this.startTime = '';
            this.endTime = '';
            this.selectedCategory = '';
            this.message = '';
          },
          error: (err) => {
            console.error(err);
            this.toastr.error(err.error?.message || 'Failed to send bid.');
          }
        });
    } else {
      this.toastr.error('Please fill in all fields');
    }
  }
}
