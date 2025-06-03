import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Component({
  standalone:false,
  selector: 'app-vendor-list',
  templateUrl: './vendor-list.component.html',
  styleUrls: ['./vendor-list.component.css']
})
export class VendorListComponent implements OnInit {
  vendors: any[] = [];
  paginatedVendors: any[] = [];
  selectedCategory: string = '';
  categories: string[] = ['Photography', 'Catering', 'Decoration', 'Music', 'Makeup'];

  pageSize: number = 5;
  currentPage: number = 1;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchVendors();
  }

  fetchVendors(): void {
    this.http.get<any[]>('http://localhost:8080/api/vendor/getvendorlist')
      .subscribe({
        next: data => {
          this.vendors = data;
          this.currentPage = 1;
          this.updatePaginatedVendors();
        },
        error: err => console.error('Failed to load vendors:', err)
      });
  }

  onCategoryChange(): void {
    if (!this.selectedCategory) {
      this.fetchVendors();
      return;
    }

    const params = new HttpParams().set('Category', this.selectedCategory);

    this.http.get<any[]>('http://localhost:8080/api/vendor/Catagory', { params })
      .subscribe({
        next: data => {
          this.vendors = data;
          this.currentPage = 1;
          this.updatePaginatedVendors();
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
}
