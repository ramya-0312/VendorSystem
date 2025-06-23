import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { HostListener } from '@angular/core';

@Component({
  standalone:false,
  selector: 'app-vendor-dashboard',
  templateUrl: './vendor-dashboard.component.html',
  styleUrls: ['./vendor-dashboard.component.css']
})
export class VendorDashboardComponent {
  activeTab = 'message';
  activaTab='update-profile';
  unreadCount: number = 0;
  notifications: any[] = [];
  vendorid: string = '';
  isNotifOpen: boolean | undefined;
  showChatBox: boolean = false;
  chatMessages: any[] = [];
  chatInput: string = '';
  senderEmail: string = '';
  senderPic: string = '';
  vendorPic: string = '';
  activeVendor: string = '';

  messages: { from: string, text: string, time: string, profilePicture?: string }[] = [];
  newMessage = '';
  typing = false;

  senderName = '';
  receiverName = '';
  receiverPic = '';
  chatContainer='';
  nativeElement:any;
  showPopupChatBox: boolean = false;


  contacts: any[] = [];



  setTab(tab: string) {
    this.activeTab=tab;
  }


  constructor(private router: Router, private toastr: ToastrService, private http: HttpClient) {}

  ngOnInit() {
  const user = JSON.parse(localStorage.getItem('vendor') || '{}');
  this.vendorid = user.id;
 console.log(user.id)
  this.fetchNotifications();
}

openFullChat() {
  this.activeTab = 'chat';
  this.showPopupChatBox = false;
}

selectContact(contact: any): void {
    this.receiverName = contact.receiver;
    this.receiverPic = contact.profilePicture;
    this.fetchMessages();
  }

   simulateTyping(): void {
    this.typing = true;
    setTimeout(() => {
      this.typing = false;
    }, 2000);
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
      //this.scrollToBottom();
    });
  }

   formatTime(date: Date): string {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  //  scrollToBottom(): void {
  //   try {
  //     this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
  //   } catch (err) {}
  // }

fetchNotifications() {
  this.http.get<any>(`http://localhost:8080/notification/id${this.vendorid}`).subscribe(data => {
    if (data && Array.isArray(data.response)) {
this.notifications = (data.response as any[]).filter((n: any) => !n.status || n.status !== 'leave');
      this.unreadCount = this.notifications.length;
    } else {
      this.notifications = [];
      this.unreadCount = 0;
    }
  });
}
// http://localhost:8080/notification/updatee2
markAsLeft(notificationId: number) {
  console.log(notificationId)
  this.http.post(`http://localhost:8080/notification/updatee${notificationId}`, {}).subscribe(() => {
    this.notifications = this.notifications.filter(note => note.id !== notificationId);
    this.unreadCount = this.notifications.length;
  });
}


openChatFromNotification(senderEmail: string) {
  this.activeVendor = senderEmail;
  this.activeTab = 'chat';
  this.showPopupChatBox = true;


  const note = this.notifications.find(n => n.sender === senderEmail);


  if (note) {
    this.chatMessages = [{
      sender: note.sender,
      message: note.message,
      timestamp: new Date()
    }];


    this.markAsLeft(note.id);
  } else {
    this.chatMessages = [];
  }
}



sendMessage() {
  if (this.chatInput.trim()) {
    const newMsg = {
      sender: this.senderEmail,
      receiver: this.activeVendor,
      message: this.chatInput.trim(),
      timestamp: new Date()
    };

    this.chatMessages.push(newMsg);
    this.chatInput = '';


  }
}


  goTo(path: string) {
    this.router.navigate([`/vendor-dashboard/${path}`]);
  }

  switchToChatTab(){
    this.activeTab = 'message';
  }

  logout() {

  }
  confirmLogout(): void {
   // Clear session and redirect
    localStorage.clear();
    this.router.navigate(['/vendor-login']);
  }
  @HostListener('document:click', ['$event'])
onClickOutside(event: Event): void {
  const target = event.target as HTMLElement;
  if (!target.closest('.dropdown')) {
    this.isNotifOpen = false;
  }
}
}
