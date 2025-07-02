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

 messages: { from: string, text: string, time: string, profilePicture: string | undefined }[] = [];


  newMessage = '';
  typing = false;

  senderName = '';
  senderEmail = '';
  senderPic = '';


  receiverName = '';
  receiverPic: string | undefined = '';

  contacts: any[] = [];

  ngOnInit(): void {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const userObj = JSON.parse(storedUser);
        this.senderName =  userObj.email || 'Unknown User';
        console.log(this.senderName);
        this.senderEmail = userObj.email || userObj.response?.email || '';
        console.log(this.senderEmail)
        this.senderPic = userObj.profilePicture || userObj.response?.profilePicture || 'https://cdn-icons-png.flaticon.com/512/147/147144.png';

        this.fetchContacts(); // Get contacts dynamically
      } catch (e) {
        console.error('Failed to parse user from localStorage', e);
      }
    }


    // this.contacts = [
    //   {
    //     name: 'Kumar',
    //     profilePicture: 'https://cdn-icons-png.flaticon.com/512/147/147144.png',
    //     lastMessage: 'sdadfsgrgvhgfhfh'
    //   },
    //   {
    //     name: 'Ramya',
    //     profilePicture: 'https://cdn-icons-png.flaticon.com/512/194/194938.png',
    //     lastMessage: 'nkjutrechg'
    //   },
    //   {
    //     name: 'vijay',
    //     profilePicture: 'https://cdn-icons-png.flaticon.com/512/2922/2922522.png',
    //     lastMessage: 'mjjuyghvb'
    //   }
    // ];



  }

  fetchContacts(): void {
    const url = `http://localhost:8080/api/chat/receivers?sender=${this.senderName}`;
    console.log(this.senderEmail);
    this.http.get<any[]>(url).subscribe({
      next: (data) => {
        this.contacts = data;
        console.log(this.contacts)
        // Auto-select the first contact if available
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
