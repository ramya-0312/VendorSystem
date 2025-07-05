import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';

declare var bootstrap: any;

@Component({
  standalone: false,
  selector: 'app-vendor-list1',
  templateUrl: './vendor-list1.component.html',
  styleUrls: ['./vendor-list1.component.css']
})
export class VendorList1Component implements OnInit {

  latitude = 13.0827
longitude = 80.2707


  showChatBox: boolean = false;
//chatMessages: { sender: string; receiver: string; content: string; timestamp?: Date }[] = [];
chatInput: string = '';
senderEmail: string = '';
//senderEmail = 'user@email.com'; // from localStorage
senderPic = ''; // or null if not available

vendorEmail = 'vendor@email.com';
vendorPic = ''; // or null if not available

  vendors: any[] = [];
  paginatedVendors: any[] = [];
  selectedCategory: string = '';
  categories: string[] = ['Photography', 'Catering', 'Decoration', 'Music', 'Makeup'];
  selectedVendor: any = null;
  showReviewBox = false;
  toggleProfileBase64: string = '';
stroningimage='';
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
  toastr: any;
  message: string = '';
  chatMessages = [
  {
    sender: this.senderEmail,
    senderPic: '', // Optional: provide image URL
    message: 'Hello!'
  },

];
  selectedVendorPic: string = '';
  //senderPic: string = 'assets/default-profile.png'; // Default profile picture

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
  const user = JSON.parse(localStorage.getItem('user') || localStorage.getItem('vendor')||'{}');
  this.senderEmail = user.email|| user.email;
  this.fetchVendors();
}
toggleChat() {
  this.showChatBox = !this.showChatBox;
  this.chatInput = '';
  this.fetchChatMessages();
}
// sender: this.senderName,
//         receiver: this.receiverName,
//         message: messageText

sendMessage() {
  if (this.chatInput.trim()) {
    const message = {
      sender: this.senderEmail,
      receiver: this.selectedVendor.email,
      message: this.chatInput,
      // timestamp: new Date()
      //  sender: this.senderName,
      //   receiver: this.receiverName,
      //   message: messageText
    };

    this.http.post('http://localhost:8080/api/chat', message).subscribe({
      next: () => {
        // 👇 Add this line to match the expected type
        this.chatMessages.push({
          sender: this.senderEmail,
          senderPic: this.getProfilePic(this.senderEmail),  // use your helper
          message: this.chatInput.trim()
        });

        this.chatInput = '';
      },
      error: err => console.error('Failed to send message:', err)
    });
  }
}




fetchChatMessages() {
  this.http.get<any[]>(`http://localhost:8080/api/chat/chat`, {
    params: {
      from: this.senderEmail,
      to: this.selectedVendor.email
    }
  }).subscribe(data => {
    this.chatMessages = data;
    console.log(data)
  });
}
//  this.messages = data.map(msg => ({
//         from: msg.sender === this.senderName ? 'me' : 'other',
//         text: msg.message,
//         time: this.formatTime(new Date(msg.createAt)),
//         profilePicture: msg.sender === this.senderName ? this.senderPic : this.receiverPic
//       }));

getInitials(name: string): string {
  if (!name) return '';
  const parts = name.trim().split(' ');
  return parts.length >= 2
    ? (parts[0][0] + parts[1][0]).toUpperCase()
    : parts[0][0].toUpperCase();
}

getProfilePic(sender: string): string {
  if (sender === this.senderEmail) {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.profilePic && user.profilePic !== ''
      ? user.profilePic
      : 'assets/default-profile.png';
  } else {
    return this.selectedVendor?.stroningimage && this.selectedVendor?.stroningimage !== ''
      ? this.selectedVendor.stroningimage
      : 'assets/default-profile.png';
  }
}




  getPercentage(star: number): number {
    const total = Object.values(this.ratingsCount).reduce((a, b) => a + b, 0);
    return total > 0 ? (this.ratingsCount[star] / total) * 100 : 0;
  }

  formatReview(text: string): string {
    return text;
  }

  openPanel(vendor: any): void {
  this.showReviewBox = false;
  this.reviews = [];
  this.averageRating = '0.0';
  this.totalReviews = '0';
  this.ratingsCount = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  this.selectedVendor = vendor;

  // Convert services object to array
  if (vendor.services && typeof vendor.services === 'object') {
    vendor.services = Object.values(vendor.services); // or Object.keys() if you need keys
  }



  this.fetchReviewsByEmail(vendor.email);
  console.log(this.selectedVendor)

}

// fetchReviewsByEmail(email: string): void {
//   this.http.get<any[]>(http://localhost:8080/api/ratings/id/${email})
//     .subscribe(data => {
//       this.reviews = data;
//       console.log(data)

//   this.selectedVendor = this.reviews;
//       // process ratings here...

//     });
// }
dp:String ="";
averageRdfating: number = 0;      // ✅ Correct type
floorRating: number = 0;
photos =[{
  mediaType:"",
  base64:""
}]

// totalReviews: number = 0;
fetchReviewsByEmail(email: string): void {
  this.http.get<any>(`http://localhost:8080/api/ratings/id/${email}`)
    .subscribe(data => {
      this.selectedVendor = data;
        this.photos = data.workPhotosBase64;
        this.dp=data.portfolioBase64;

console.log(this.selectedVendor.workPhotosBase64);
      // ✅ This is the key part - ensure workPhotosBase64 is set
      this.selectedVendor.workPhotosBase64 = data.portfolioBase64 || [];

      this.averageRdfating = Number(data.averageRating);
      this.floorRating = Math.floor(this.averageRdfating);
      this.totalReviews = data.ratings.length;

      this.ratingsCount = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
      data.ratings.forEach((r: any) => {
        const rating = r.ratingValue;
        if (this.ratingsCount[rating] !== undefined) {
          this.ratingsCount[rating]++;
        }
      });

      this.reviews = data.ratings.map((r: any) => ({
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
      vendormail: this.selectedVendor.email,
      rating: this.rating,
      review: this.reviewText.trim()
    };

    this.http.post('http://localhost:8080/api/ratings/add', reviewPayload)
      .subscribe({
        next: (response: any) => {
          this.toastr.success('Login successful!');
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
    this.http.get<any[]>(`http://localhost:8080/api/vendor/Catagory?`, { params })
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
  getImageSrc(base64: string): string {
  if (base64.startsWith('data:image')) {
    return base64; // Already a complete data URI
  }
  return `data:image/jpeg;base64,${base64}`; // Or png, adjust based on actual content
}
isVideo(mediaType: string): boolean {
  return mediaType?.startsWith('video/');
}

getMediaSrc(media: { mediaType: string; base64: string }): string {
  return `data:${media.mediaType};base64,${media.base64}`;
}

getGoogleMapsUrl(): string {
  if (this.selectedVendor?.latitude && this.selectedVendor?.longitude) {
    return `https://www.google.com/maps?q=${this.selectedVendor.latitude},${this.selectedVendor.longitude}`;
  }
  return '#';
}

openMap() {
  const url = this.getGoogleMapsUrl();
  if (url !== '#') {
    window.open(url, '_blank');
  }
}



getVendorProfileLink(): string {
  const baseUrl = window.location.origin;
  return `${baseUrl}/vendor-profile/${this.selectedVendor?.email}`;
}


getWhatsAppShareUrl(): string {
  const text = `Check out this vendor profile: ${this.getVendorProfileLink()}`;
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}


getEmailShareUrl(): string {
  const subject = 'Vendor Profile Recommendation';
  const body = `Hi,\n\nCheck out this vendor I found:\n${this.getVendorProfileLink()}`;
  return `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}


copyProfileLink(): void {
  const link = this.getVendorProfileLink();
  navigator.clipboard.writeText(link).then(() => {
    alert('Profile link copied to clipboard!');
  }, () => {
    alert('Failed to copy link.');
  });
}
}
