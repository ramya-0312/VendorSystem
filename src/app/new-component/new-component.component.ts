import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  standalone:false,
  selector: 'app-new-component',
  templateUrl: './new-component.component.html'
})
export class NewComponentComponent {
  code = 'print("Hello World")';
  expectedOutput = 'Hello World';
  actualOutput = '';
  result = '';
  error = '';

  constructor(private http: HttpClient) {}

  runCode() {
    const payload = {
      source_code: this.code,
      language_id: 71,
      stdin: '',
    };

    this.http.post<any>('https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true', payload, {
      headers: {
        'Content-Type': 'application/json',
        'X-RapidAPI-Key': 'f193c3fad3msh97b06a0645a7b10p13c644jsn088725aabd9c',
        'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
      }
    }).subscribe(res => {
      this.actualOutput = (res.stdout || '').trim();
      this.result = this.actualOutput === this.expectedOutput.trim() ? '✅ Passed' : '❌ Failed';
      this.error = res.stderr || res.compile_output || '';
    });
  }
}
