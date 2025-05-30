import { Component, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  standalone: false,
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements AfterViewChecked {
  @ViewChild('scrollMe') private chatContainer!: ElementRef;

  messages: { from: string; text: string; time: string }[] = [
    { from: 'me', text: 'Hi!', time: this.formatTime(new Date()) },
    { from: 'other', text: 'Hello, how can I help you?', time: this.formatTime(new Date()) }
  ];

  newMessage = '';
  typing = false;

  constructor(private http: HttpClient) {}

  sendMessage() {
    if (this.newMessage.trim()) {
      const messageText = this.newMessage.trim();
      const time = this.formatTime(new Date());

      
      this.messages.push({ from: 'me', text: messageText, time });
      this.newMessage = '';
      this.typing = false;
      this.scrollToBottom();


      const payload = {
        sender: 'user',
        receiver: 'admin',
        message: messageText
      };

      // API call
      this.http.post<any>('https://your-api-url.com/api/chat', payload).subscribe({
        next: (response) => {
          const reply = response.reply || 'No reply.';
          this.messages.push({ from: 'other', text: reply, time: this.formatTime(new Date()) });
          this.scrollToBottom();
        },
        error: () => {
          this.messages.push({ from: 'other', text: 'Error: Unable to get response.', time: this.formatTime(new Date()) });
          this.scrollToBottom();
        }
      });
    }
  }

  formatTime(date: Date): string {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
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
