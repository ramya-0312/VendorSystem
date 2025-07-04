import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

interface WorkImageDTO {
  id: number;
  base64: string;
  mediaType: string; // Added to differentiate images and videos
}

@Component({
  selector: 'app-image',
  standalone: false,
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.css']
})
export class ImageComponent implements OnInit {
  selectedFiles: File[] = [];
  base64Images: WorkImageDTO[] = [];
  vendorId: number | null = null;

  constructor(private http: HttpClient, private toastr: ToastrService) {}

  ngOnInit() {
    const vendor = JSON.parse(localStorage.getItem('vendor') || '{}');
    this.vendorId = vendor.id || null;
  }

  onFileSelected(event: any) {
    this.selectedFiles = Array.from(event.target.files);
  }

  uploadImages() {
    if (!this.vendorId || this.selectedFiles.length === 0) {
      this.toastr.error('Files are required');
      return;
    }

    const formData = new FormData();
    this.selectedFiles.forEach(file => formData.append('files', file));
    formData.append('vendorId', this.vendorId.toString());

    this.http.post(`http://localhost:8080/api/vendor/${this.vendorId}/upload-work-photos`, formData)
      .subscribe({
        next: () => {
          this.selectedFiles = [];
          this.getWorkImages();
          this.toastr.success('Photos uploaded successfully!');
        },
        error: (err) => {
          console.error(err);
          this.toastr.error('Failed to upload photos');
        }
      });
  }

  removeImage(id: number, index: number) {
    if (this.vendorId === null) return;

    this.http.delete(`http://localhost:8080/api/vendor/iddelete/${id}`)
      .subscribe({
        next: () => {
          this.base64Images.splice(index, 1);
          this.toastr.success('Media deleted from server');
        },
        error: (err) => {
          console.error(err);
          this.toastr.error('Failed to delete media');
        }
      });
  }

  getWorkImages() {
    if (!this.vendorId) {
      this.toastr.error('Vendor ID not found');
      return;
    }

    this.http.get<WorkImageDTO[]>(`http://localhost:8080/api/vendor/${this.vendorId}/work-photos`)
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
