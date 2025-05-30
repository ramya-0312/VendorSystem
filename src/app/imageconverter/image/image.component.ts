import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-image',
  standalone: false,
  templateUrl: './image.component.html',
  styleUrl: './image.component.css'
})
export class ImageComponent {
  base64Image: string | null = null;
  imageId: number =2;

  constructor(private http: HttpClient) {}

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        this.base64Image = reader.result as string;
      };

      reader.readAsDataURL(file);
    } else {
      this.base64Image = null;
    }
  }

  sendImageToBackend(): void {
    if (!this.base64Image) {
      console.warn('No image selected!');
      return;
    }

    const payload = {
      image: this.base64Image,
      name: "vijay"
    };

    this.http.post('http://localhost:8080/api/upload-image', payload).subscribe({
      next: (res) => console.log('Image uploaded successfully', res),
      error: (err) => console.error('Upload failed', err),
    });

    
  }
   fetchImageFromBackend(id: number) {
    this.http.get<any>(`http://localhost:8080/api/get-image/3`).subscribe({
      next: (response) => {
        this.base64Image = response.image;
      },
      error: (err) => console.error('Image load failed', err),
    });
  }
}
