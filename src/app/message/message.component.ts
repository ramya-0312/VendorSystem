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

  constructor(private http: HttpClient) {}

  messages = [
    { from: 'me', text: 'Hi!', time: this.formatTime(new Date()) },
    { from: 'other', text: 'Hello, how can I help you?', time: this.formatTime(new Date()) }
  ];
  newMessage = '';
  typing = false;

  sendMessage() {
    if (this.newMessage.trim()) {
      const messageText = this.newMessage.trim();
      const time = this.formatTime(new Date());


      this.messages.push({ from: 'me', text: messageText, time });
      this.newMessage = '';
      this.typing = false;

      this.scrollToBottom();

      
      this.http.post<any>('https://your-api-url.com/api/chat', { message: messageText }).subscribe({
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

  simulateTyping() {
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
