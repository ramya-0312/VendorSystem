import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-image',
  standalone: false,
  templateUrl: './image.component.html',
  styleUrl: './image.component.css'
})
export class ImageComponent {
  vendorId: number | null = null;
  selectedFiles: File[] = [];
  base64Images: string[] = [];

  constructor(private http: HttpClient, private toastr: ToastrService) {}

  onFileSelected(event: any) {
    this.selectedFiles = Array.from(event.target.files);
  }

  uploadImages() {
  if (!this.vendorId || this.selectedFiles.length === 0) {
    this.toastr.error('Vendor ID and files are required');
    return;
  }

  const formData = new FormData();
  this.selectedFiles.forEach(file => formData.append('files', file));
  formData.append('vendorId', this.vendorId.toString());

  this.http.post(`http://localhost:8080/api/vendor/${this.vendorId}/upload-work-photos`, formData)
    .subscribe({
      next: (res: any) => {
        this.toastr.success(res.message || 'Images uploaded successfully!');
        this.selectedFiles = [];
      },
      error: err => {
        console.error(err);
        this.toastr.error('Upload failed!');
      }
    });
}
getWorkImages() {
  if (!this.vendorId) {
    this.toastr.error('Please enter Vendor ID');
    return;
  }

  this.http.get<string[]>(`http://localhost:8080/api/vendor/${this.vendorId}/work-photos`)
    .subscribe({
      next: (images) => {
        this.base64Images = images;
        this.toastr.success('Photos loaded!');
      },
      error: (err) => {
        console.error(err);
        this.toastr.error('Failed to load images');
      }
    });
}
}