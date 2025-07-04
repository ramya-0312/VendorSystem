import { Component, ElementRef, ViewChild, AfterViewChecked, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  standalone: false,
  selector: 'app-vendor-chat',
  templateUrl: './vendor-chat.component.html',
  styleUrls: ['./vendor-chat.component.css']
})
export class VendorChatComponent implements OnInit, AfterViewChecked {
 ;
  @ViewChild('scrollMe') private chatContainer!: ElementRef;

  constructor(private http: HttpClient) {}

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

  ngOnInit(): void {

    const storedUser = localStorage.getItem('vendor');
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
    }
  }

   viewingVendorProfile = false;

 openVendorProfile() {
  this.viewingVendorProfile = true;

  this.http.get<any[]>('http://localhost:8080/api/vendor/getvendorlist').subscribe({
    next: (vendors) => {
      const matched = vendors.find(v => v.email === this.receiverName || v.businessName === this.receiverName);
      if (matched) {
        this.vendorDetails = {
          id: matched.id,
          name: matched.businessName,
          email: matched.email,
          phone: matched.phone,
          address: matched.location,
          category: matched.category,
          photo: matched.portfolioBase64 || this.defaultProfile,
          documents: [matched.certificationImageBase64]
        };
      } else {
        console.warn('Vendor not found for:', this.receiverName);
      }
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
}
