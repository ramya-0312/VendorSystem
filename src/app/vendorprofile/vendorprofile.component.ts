// import { Component, OnInit } from '@angular/core';
// import { HttpClient, HttpParams } from '@angular/common/http';

// @Component({
//   standalone:false,
//   selector: 'app-vendorprofile',
//   templateUrl: './vendorprofile.component.html',
//   styleUrls: ['./vendorprofile.component.css']
// })

// export class VendorprofileComponent implements OnInit {
//   vendors: any[] = [];
//   paginatedVendors: any[] = [];
//   selectedCategory: string = '';
//   categories: string[] = ['Photography', 'Catering', 'Decoration', 'Music', 'Makeup'];
//   selectedVendor: any = null;
//   bootstrap :any; // Import Bootstrap for tab functionality




//   pageSize: number = 5;
//   currentPage: number = 1;

//   toggleDetails: { [email: string]: boolean } = {}; // NEW: Track expanded cards

//   constructor(private http: HttpClient) {}

//   ngOnInit(): void {
//     this.fetchVendors();
//   }

//   openPanel(vendor: any): void {
//   this.selectedVendor = vendor;
// }

// getStarsArray(rating: number): number[] {
//   return Array(Math.round(rating)).fill(0);
// }

// closePanel(): void {
//   this.selectedVendor = null;
// }

//   fetchVendors(): void {
//     this.http.get<any[]>('http://localhost:8080/api/vendor/getvendorlist')
//       .subscribe({
//         next: data => {
//           this.vendors = data;
//           this.currentPage = 1;
//           this.updatePaginatedVendors();

//           // Initialize toggleDetails map
//           data.forEach(v => this.toggleDetails[v.email] = false);
//         },
//         error: err => console.error('Failed to load vendors:', err)
//       });
//   }

//   onCategoryChange(): void {
//     if (!this.selectedCategory) {
//       this.fetchVendors();
//       return;
//     }

//     const params = new HttpParams().set('category', this.selectedCategory);

//     this.http.get<any[]>('http://localhost:8080/api/vendor/Catagory', { params })
//       .subscribe({
//         next: data => {
//           this.vendors = data;
//           this.currentPage = 1;
//           this.updatePaginatedVendors();

//           data.forEach(v => this.toggleDetails[v.email] = false);
//         },
//         error: err => console.error('Failed to load filtered vendors:', err)
//       });
//   }

//   updatePaginatedVendors(): void {
//     const start = (this.currentPage - 1) * this.pageSize;
//     const end = start + this.pageSize;
//     this.paginatedVendors = this.vendors.slice(start, end);
//   }

//   goToNextPage(): void {
//     if ((this.currentPage * this.pageSize) < this.vendors.length) {
//       this.currentPage++;
//       this.updatePaginatedVendors();
//     }
//   }

//   goToPreviousPage(): void {
//     if (this.currentPage > 1) {
//       this.currentPage--;
//       this.updatePaginatedVendors();
//     }
//   }

//   toggleProfile(email: string): void {
//     this.toggleDetails[email] = !this.toggleDetails[email];
//   }

//   isExpanded(email: string): boolean {
//     return this.toggleDetails[email];
//   }

//   getStars(rating: number): number[] {
//     return Array(Math.round(rating || 0)).fill(0);
//   }

//    goToChatTab() {
//     const chatTabEl = document.querySelector('chatTab');
//     if (chatTabEl) {
//       const tab = new this.bootstrap.Tab(chatTabEl);
//       tab.show();
//     }
//   }

// }
