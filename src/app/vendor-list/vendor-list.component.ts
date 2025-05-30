import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  standalone:false,
  selector: 'app-vendor-list',
  templateUrl: './vendor-list.component.html',
  styleUrls: ['./vendor-list.component.css']
})
export class VendorListComponent implements OnInit {
  vendors: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchVendors();
  }

  fetchVendors() {
    this.http.get<any[]>('http://localhost:8080/api/vendors') // Update with actual backend
      .subscribe({
        next: data => this.vendors = data,
        error: err => console.error('Failed to load vendors:', err)
      });
  }

  getStars(count: number): number[] {
    return Array(count).fill(0);
  }
}
