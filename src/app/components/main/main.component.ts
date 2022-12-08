import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {
  @ViewChild('inputElement') inputElement!: ElementRef<HTMLInputElement>;
  @ViewChild('contentElement') contentElement!: ElementRef<HTMLDivElement>;
  @ViewChild('mainElement') mainElement!: ElementRef<HTMLElement>;

  quote: string = '';
  userInput: string = '';
  disabled: boolean = true;

  constructor(private http: HttpService) {}

  ngOnInit(): void {
    this.http.getRandomQuote().subscribe((res) => (this.quote = res.content));
  }

  inputFocus(e: MouseEvent): void {
    e.stopPropagation();
    if (this.disabled) return;
    this.contentElement.nativeElement.classList.add('focused');
    this.inputElement.nativeElement.focus();
  }

  inputUnfocus(e: MouseEvent): void {
    e.stopPropagation();
    this.contentElement.nativeElement.classList.remove('focused');
    this.inputElement.nativeElement.blur();
  }

  handleStart(): void {
    this.disabled = false;
    this.contentElement.nativeElement.classList.add('focused');
    this.inputElement.nativeElement.focus();
  }

  handleEnd(): void {
    this.disabled = true;
    this.contentElement.nativeElement.classList.remove('focused');
    this.inputElement.nativeElement.blur();
  }
}
