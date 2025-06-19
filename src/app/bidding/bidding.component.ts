import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-bidding',
  standalone: false,
  templateUrl: './bidding.component.html',
  styleUrl: './bidding.component.css'
})
export class BiddingComponent {
  categories = ['Photography', 'Catering', 'Decoration', 'Music', 'Makeup'];
  selectedCategory = '';
  message = '';

  constructor(private toastr: ToastrService) {}
  onCategoryChange(event: any) {
    this.selectedCategory = event.target.value;
  }

  sendBid() {
    if (this.selectedCategory && this.message) {
      console.log('Bidding sent:', {
        category: this.selectedCategory,
        message: this.message
      });


      this.message = '';
      this.toastr.success('Bid sent successfully!');
    } else {
      this.toastr.error('Please fill all fields');
    }
  }

}
