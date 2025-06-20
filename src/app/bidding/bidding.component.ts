import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

@Component({
  standalone:false,
  selector: 'app-bidding',
  templateUrl: './bidding.component.html',
  styleUrls: ['./bidding.component.css']
})
export class BiddingComponent {
  categories = ['Photography', 'Catering', 'Decoration', 'Music', 'Makeup'];
  selectedCategory = '';
  message = '';
 

  constructor(private http: HttpClient, private toastr: ToastrService) {}

  onCategoryChange(event: any) {
    this.selectedCategory = event.target.value;
  }

  sendBid() {
    if (this.selectedCategory && this.message) {
      const payload = {
        category: this.selectedCategory,
        message: this.message
      };

      this.http.post('http://localhost:8080/notification/sentbid', payload)
        .subscribe({
          next: (res:any) => {
// let response=JSON.parse(res);

            this.toastr.success(res.response);
            this.message = '';
            this.selectedCategory = '';
          },
          error: (err) => {
            // let error = JSON.parse(err)
            console.error(err);
            this.toastr.error(err.error.message);
          }
        });
    } else {
      this.toastr.error('Please fill all fields');
    }
  }
}
