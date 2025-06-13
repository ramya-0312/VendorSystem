import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';

declare var bootstrap: any;

@Component({
  standalone: false,
  selector: 'app-vendor-list',
  templateUrl: './vendor-list.component.html',
  styleUrls: ['./vendor-list.component.css']
})
export class VendorListComponent implements OnInit {
  vendors: any[] = [];
  paginatedVendors: any[] = [];
  selectedCategory: string = '';
  categories: string[] = ['Photography', 'Catering', 'Decoration', 'Music', 'Makeup'];
  selectedVendor: any = null;
  showReviewBox = false;
  toggleProfileBase64: string = '';

  rating = 0;
  reviewText = '';
  submitted = false;
  averageRating = '0.0';
  totalReviews = '0';
  ratingsCount: { [key: number]: number } = {
    5: 0,
    4: 0,
    3: 0,
    2: 0,
    1: 0,
  };


  reviews: any[] = [];


  pageSize: number = 5;
  currentPage: number = 1;
  toggleDetails: { [email: string]: boolean } = {};

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.fetchVendors();
  }

  getPercentage(star: number): number {
    const total = Object.values(this.ratingsCount).reduce((a, b) => a + b, 0);
    return total > 0 ? (this.ratingsCount[star] / total) * 100 : 0;
  }

  formatReview(text: string): string {
    return text;
  }
openPanel(vendor: any): void {
  console.log("Opening vendor panel:", vendor);

  this.showReviewBox = true;
  this.reviews = [];
  this.averageRating = '0.0';
  this.totalReviews = '0';
  this.ratingsCount = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

  // ✅ Convert object to array if needed
  if (vendor.workPhotosBase64 && typeof vendor.workPhotosBase64 === 'object') {
    vendor.workPhotosBase64 = Object.values(vendor.workPhotosBase64);
  }

  this.fetchReviewsByEmail(vendor.email);
  this.selectedVendor = vendor;
}


//
averageRdfating: number = 0;      // ✅ Correct type
floorRating: number = 0;
// totalReviews: number = 0;
fetchReviewsByEmail(email: string): void {
  this.http.get<any>(`http://localhost:8080/api/ratings/id/${email}`)
    .subscribe(data => {
      this.averageRdfating = Number(data.averageRating);  // ✅ Typecast here
      this.floorRating = Math.floor(this.averageRdfating);
      this.totalReviews = data.ratings.length;

      this.reviews = data.ratings.map((r: any) => ({
        // avatar: 'assets/default-profile.png',
        rating: r.ratingValue,
        review: r.review,
        userEmail: r.userEmail
      }));
    });
}
  closePanel(): void {
    this.selectedVendor = null;
  }

  setRating(star: number): void {
    this.rating = star;
  }

  submitReview(): void {
  if (this.rating > 0 && this.reviewText.trim()) {
    this.submitted = true;
    this.showReviewBox = false;

    const userObj = JSON.parse(localStorage.getItem('user') || '{}');
const userEmail = userObj.email;  // e.g. set during login
    // const vendorEmail = localStorage.getItem('vendorEmail'); // e.g. set when viewing a vendor profile
console.log(userEmail)
    // if (!userEmail || !vendorEmail) {
    //   alert("Missing user or vendor email. Please try again.");
    //   return;
    // }

    const reviewPayload = {
      usermail: userEmail,
      vendormail:this.selectedVendor.e,
      rating: this.rating,
      review: this.reviewText.trim()
    };

    this.http.post('http://localhost:8080/api/ratings/add', reviewPayload)
      .subscribe({
        next: (response: any) => {
          const newReview = {
            avatar: 'https://i.pravatar.cc/40?img=' + (Math.floor(Math.random() * 70) + 1),
            rating: this.rating,
            text: this.reviewText.trim()
          };

          this.reviews.unshift(newReview);

          if (!this.ratingsCount[this.rating]) {
            this.ratingsCount[this.rating] = 1;
          } else {
            this.ratingsCount[this.rating]++;
          }

          const total = Object.values(this.ratingsCount).reduce((a, b) => a + b, 0);
          const weightedSum = Object.entries(this.ratingsCount)
            .reduce((sum, [star, count]) => sum + (+star * count), 0);

          this.totalReviews = total.toString();
          this.averageRating = (weightedSum / total).toFixed(1);

          this.rating = 0;
          this.reviewText = '';
        },
        error: (err) => {
          alert('Failed to submit review. Try again later.');
          console.error(err);
        }
      });
  } else {
    alert("Please provide both rating and review.");
  }
}



  getStarsArray(rating: number): number[] {
    return Array(Math.round(rating)).fill(0);
  }

  round(value: number): number {
    return Math.round(value);
  }

  fetchVendors(): void {
    this.http.get<any[]>('http://localhost:8080/api/vendor/getvendorlist')
      .subscribe({
        next: data => {
          this.vendors = data;
          this.currentPage = 1;
          this.updatePaginatedVendors();
         // localStorage.setItem('vendors', JSON.stringify(this.vendors));
          data.forEach(v => this.toggleDetails[v.email] = false);
        },
        error: err => console.error('Failed to load vendors:', err)
      });
  }

  onCategoryChange(): void {
    if (!this.selectedCategory) {
      this.fetchVendors();
      return;
    }

    const params = new HttpParams().set('category', this.selectedCategory);
    this.http.get<any[]>('http://localhost:8080/api/vendor/Catagory', { params })
      .subscribe({
        next: data => {
          this.vendors = data;
          this.currentPage = 1;
          this.updatePaginatedVendors();
          data.forEach(v => this.toggleDetails[v.email] = false);
          localStorage.setItem('vendors', JSON.stringify(this.vendors));
        },
        error: err => console.error('Failed to load filtered vendors:', err)
      });
  }

  updatePaginatedVendors(): void {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.paginatedVendors = this.vendors.slice(start, end);
  }

  goToNextPage(): void {
    if ((this.currentPage * this.pageSize) < this.vendors.length) {
      this.currentPage++;
      this.updatePaginatedVendors();
    }
  }

  goToPreviousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedVendors();
    }
  }

  toggleProfile(email: string): void {
    this.toggleDetails[email] = !this.toggleDetails[email];
  }

  isExpanded(email: string): boolean {
    return this.toggleDetails[email];
  }

  getStars(rating: number): number[] {
    return Array(Math.round(rating || 0)).fill(0);
  }

  getRounded(value: any): number {
    return Math.round(Number(value));
  }

  goToChatTab(): void {
    const chatTabEl = document.querySelector('#chatTab');
    if (chatTabEl) {
      const tab = new bootstrap.Tab(chatTabEl);
      tab.show();
    }
  }
}
