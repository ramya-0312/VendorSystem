import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { HostListener } from '@angular/core';
import { VendorChatComponent } from '../vendor-chat/vendor-chat.component';

@Component({
  standalone:false,
  selector: 'app-vendor-dashboard',
  templateUrl: './vendor-dashboard.component.html',
  styleUrls: ['./vendor-dashboard.component.css']
})
export class VendorDashboardComponent {
   @ViewChild(VendorChatComponent) chatComponent!: VendorChatComponent
  activeTab = 'vendor chat'
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
  activeVendorEmail: string = '';


  senderName = '';
  receiverName = '';
  receiverPic = '';
  chatContainer='';
  nativeElement:any;
  showPopupChatBox: boolean = false;
  selectedVendor: any = null;


  contacts: any[] = [];
  selectedReceiverEmail: any;



  setTab(tab: string) {
    this.activeTab=tab;
    console.log(this.activeTab)
  }
resetVendorView() {
  this.activeTab = 'chat';
  // Optional: Use a shared service or Output event to notify vendor list to reset
}



  constructor(private router: Router, private toastr: ToastrService, private http: HttpClient) {}

  ngOnInit() {
    this.activeTab = '';
    this.senderEmail = localStorage.getItem('userEmail') || '';
  const user = JSON.parse(localStorage.getItem('vendor') || '{}');
  this.vendorid = user.id;
  this.senderEmail= user.email
  this.selectedVendor = null;
   console.log(this.activeTab)
 console.log(user.id)
  this.fetchNotifications();
  // console.log(this.fetchMessages)
}

 openFullChat() {
    this.activeTab = 'chat';
    this.showPopupChatBox = false;
    this.activeVendor = '';

    // ✅ Trigger after DOM updates
    setTimeout(() => {
      this.chatComponent?.fetchContacts();
    }, 100);
  }

selectContact(contact: any): void {
  console.log(7)
    this.receiverName = contact.receiver;
    this.receiverPic = contact.profilePicture;
    // this.fetchMessages();
  }

   simulateTyping(): void {
    this.typing = true;
    setTimeout(() => {
      this.typing = false;
    }, 2000);
  }
   formatTime(date: Date): string {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
fetchNotifications() {
  this.http.get<any>(`http://localhost:8080/notification/id${this.vendorid}`).subscribe(data => {
    if (data && Array.isArray(data.response)) {
this.notifications = (data.response as any[]).filter((n: any) => !n.status || n.status !== 'leave');
      this.unreadCount = this.notifications.length;
      console.log(this.notifications)
    } else {
      this.notifications = [];
      this.unreadCount = 0;
    }
  });
}

markAsLeft(notificationId: number) {
  console.log(notificationId)
  this.http.post(`http://localhost:8080/notification/updatee${notificationId}`, {}).subscribe(() => {
    this.notifications = this.notifications.filter(note => note.id !== notificationId);

    this.unreadCount = this.notifications.length;
  });
}


openChatFromNotification(note: any) {
  this.activeVendor = note.sender;
  this.activeTab = 'chat';
  this.showPopupChatBox = true;
  this.activeVendorEmail = note.sender;
  this.selectedReceiverEmail = note.email;


  this.chatMessages = [{
    sender: note.sender,
    message: note.message,
    timestamp: new Date(),
    startTime: note.startTime,
    endTime: note.endTime
  }];

  this.markAsLeft(note.id);
}




sendMessage() {
  const messageText = this.chatInput.trim();
  if (!messageText) return;


  const payload = {
    sender: this.senderEmail,
    receiver: this.selectedReceiverEmail,
    message: messageText
  };


  this.chatMessages.push({
    sender: this.senderEmail,
    message: messageText,
    timestamp: new Date()
  });

  this.chatInput = '';


  this.http.post<any>('http://localhost:8080/api/chat', payload).subscribe({
    next: () => {
      // this.fetchMessages(); // Refresh messages from backend
    },
    error: () => {
      this.chatMessages.push({
        sender: 'system',
        message: '❌ Error: Unable to send message.',
        timestamp: new Date()
      });
    }
  });
}
  goTo(path: string) {
    this.router.navigate([`/vendor-dashboard/${path}`]);
  }

  switchToChatTab(){
    this.activeTab = 'vendor-chat';
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
 setActiveTab(tab: string) {
  this.activeTab = tab;

  if (tab === 'vendor-chat') {

    setTimeout(() => {
      this.chatComponent?.fetchContacts();
    }, 100); // Give time for DOM/component to be ready
  }
}

}
