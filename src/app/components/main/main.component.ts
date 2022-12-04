import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { textData } from 'src/app/textData';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {
  @ViewChild('inputElement') inputElement!: ElementRef<HTMLInputElement>;
  paragraph: string = '';
  userInput: string = '';

  constructor() {}

  ngOnInit(): void {
    this.paragraph = textData[Math.floor(Math.random() * textData.length)];
  }

  inputFocus(): void {
    this.inputElement.nativeElement.focus();
  }
}
