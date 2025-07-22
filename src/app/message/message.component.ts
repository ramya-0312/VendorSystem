import { Component, ElementRef, ViewChild, AfterViewChecked, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  standalone: false,
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit, AfterViewChecked {
  @ViewChild('scrollMe') private chatContainer!: ElementRef;

  constructor(private http: HttpClient) {}


getprofile:any=null;

  messages: { from: string, text: string, time: string, profilePicture?: string }[] = [];
  newMessage = '';
  typing = false;
  receiverId: string = '';
  showVendorProfile = false;
  vendorDetails: any = null;
  defaultProfile = 'assets/default-avatar.png';

  senderName = '';
  senderEmail = '';
  senderPic = '';

  receiverName = '';
  receiverPic: string | undefined = '';

  contacts: any[] = [];

  isVendor = false;

  ngOnInit(): void {

    const storedUser = localStorage.getItem('user');
    const storedVendor = localStorage.getItem('vendor');
    if (storedVendor) {
      this.isVendor = true;
    } else {
      this.isVendor = false;
    }


    // const storedUser = localStorage.getItem('vendor');

    if (storedUser) {
      try {
        const userObj = JSON.parse(storedUser);
        this.senderName =  userObj.email || 'Unknown User';
        this.senderEmail = userObj.email || userObj.response?.email || '';
        this.senderPic = userObj.profilePicture || userObj.response?.profilePicture || 'https://cdn-icons-png.flaticon.com/512/147/147144.png';

        this.fetchContacts(); // Get contacts dynamically
      } catch (e) {
        console.error('Failed to parse user from localStorage', e);
      }
    } else if (storedVendor) {
      try {
        const vendorObj = JSON.parse(storedVendor);
        this.senderName = vendorObj.email || 'Unknown Vendor';
        this.senderEmail = vendorObj.email || vendorObj.response?.email || '';
        this.senderPic = vendorObj.profilePicture || vendorObj.response?.profilePicture || 'https://cdn-icons-png.flaticon.com/512/147/147144.png';
        this.fetchContacts();
      } catch (e) {
        console.error('Failed to parse vendor from localStorage', e);
      }
    }










  }

   viewingVendorProfile = false;

 openVendorProfile() {
  this.viewingVendorProfile = true;

  this.http.get<any[]>(`http://localhost:8080/api/ratings/id/${this.receiverName}`).subscribe({
    next: (vendors) => {
      this.getprofile=vendors;
      console.log(this.getprofile.id)
      console.log(this.getprofile)


        console.log(this.receiverName)
        this.vendorDetails = {
          id: this.getprofile.businessName,
          name: this.getprofile.businessName,
          email: this.getprofile.email,
          phone: this.getprofile.phone,
          address: this.getprofile.location,
          category: this.getprofile.category,
          photo: this.getprofile.portfolioBase64 || this.defaultProfile,

          documents: this.getprofile.workPhotosBase64
        };
      console.log(this.vendorDetails)
      // console.log(documents.length)
    },
    error: (err) => {
      console.error('Error fetching vendor list:', err);
    }
  });
}



  closeVendorProfile() {
  this.showVendorProfile = false;
}
backToChat() {
  this.viewingVendorProfile = false;
}




  fetchContacts(): void {
    const url = `http://localhost:8080/api/chat/receivers?sender=${this.senderName}`;
    console.log(this.senderEmail);
    this.http.get<any[]>(url).subscribe({
      next: (data) => {
        this.contacts = data;
        console.log(this.contacts)

        if (this.contacts.length > 0) {
          this.selectContact(this.contacts[0]);
        }
      },
      error: (err) => {
        console.error('Failed to load contacts', err);
      }
    });
  }

  selectContact(contact: any): void {
    this.receiverName = contact.receiver;
    this.receiverPic = contact.profilePicture;
    this.fetchMessages();

  }

  fetchMessages(): void {
    const url = `http://localhost:8080/api/chat/chat?from=${this.senderName}&to=${this.receiverName}`;
    this.http.get<any[]>(url).subscribe(data => {
      this.messages = data.map(msg => ({
        from: msg.sender === this.senderName ? 'me' : 'other',
        text: msg.message,
        time: this.formatTime(new Date(msg.createAt)),
        profilePicture: msg.sender === this.senderName ? this.senderPic : this.receiverPic
      }));
      this.scrollToBottom();
    });
  }

  sendMessage(): void {
    if (this.newMessage.trim()) {
      const messageText = this.newMessage.trim();
      const time = this.formatTime(new Date());

      this.messages.push({ from: 'me', text: messageText, time, profilePicture: this.senderPic });
      this.newMessage = '';
      this.typing = false;
      this.scrollToBottom();

      const payload = {
        sender: this.senderName,
        receiver: this.receiverName,
        message: messageText
      };

      this.http.post<any>('http://localhost:8080/api/chat', payload).subscribe({
        next: () => this.fetchMessages(),
        error: () => {
          this.messages.push({
            from: 'other',
            text: 'Error: Unable to send.',
            time: this.formatTime(new Date()),
            profilePicture: this.receiverPic
          });
          this.scrollToBottom();
        }
      });
    }
  }

  formatTime(date: Date): string {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  simulateTyping(): void {
    this.typing = true;
    setTimeout(() => {
      this.typing = false;
    }, 2000);
  }

  scrollToBottom(): void {
    try {
      this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
    } catch (err) {}
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }
   getImageSrc(base64: string): string {
  if (base64?.startsWith('data:image')) {
    return base64; // Already a complete data URI
  }
  // console.log(this.vendorDetails.photo)
  return `data:image/jpeg;base64,${base64}`; // Or png, adjust based on actual content
  // data:image/jpeg;Base64
}
isVideo(mediaType: string): boolean {
  return mediaType?.startsWith('video/');
}

getMediaSrc(media: { mediaType: string; base64: string }): string {
   console.log( `data:${media.mediaType};base64,${media.base64}`);
  return `data:${media.mediaType};base64,${media.base64}`;

}
}
