import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Subscription, timer } from 'rxjs';
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
  countdownSub: Subscription | null = null;
  countdown: number = 5;
  gameStarted: boolean = false;
  gameTimeSub: Subscription | null = null;
  gameStartTime: number | null = null;
  gameEndTime: number | null = null;
  userGameTime: number = 0;
  score: {
    userScore: number;
    maxScore: number;
    wpm: number;
    cwpm: number;
  } | null = null;

  constructor(private http: HttpService) {}

  ngOnInit(): void {
    this.http.getRandomQuote().subscribe((res) => (this.quote = res.content));
  }

  ngOnDestry(): void {
    this.countdownSub?.unsubscribe();
  }

  inputChange(input: string): void {
    this.userInput = input;
    if (this.gameStartTime && this.userInput.length >= this.quote.length) {
      this.userGameTime = new Date().getTime();
      this.score = this.calculateScore(
        this.quote,
        this.userInput,
        this.userGameTime
      );
      this.endGame();
    }
  }

  inputFocus(e: MouseEvent): void {
    e.stopPropagation();
    if (!this.gameStarted) return;
    this.contentElement.nativeElement.classList.add('focused');
    this.inputElement.nativeElement.focus();
  }

  inputUnfocus(e: MouseEvent): void {
    e.stopPropagation();
    this.contentElement.nativeElement.classList.remove('focused');
    this.inputElement.nativeElement.blur();
  }

  ngOnDestroy(): void {
    this.countdownSub?.unsubscribe();
    this.gameTimeSub?.unsubscribe();
  }

  startCountdown(): void {
    if (this.countdownSub) return;
    this.resetGame();
    this.countdownSub = timer(0, 1000).subscribe(() => {
      const newTime = this.countdown - 1;
      if (newTime > 0) {
        this.countdown = newTime;
      } else {
        this.startGameTimer();
      }
    });
  }

  startGameTimer(): void {
    this.gameStarted = true;
    this.gameStartTime = new Date().getTime();
    this.gameEndTime = new Date().getTime() + (this.quote.length / 5) * 1000;
    this.countdownSub?.unsubscribe();
    this.countdownSub = null;
    this.contentElement.nativeElement.classList.add('focused');
    this.inputElement.nativeElement.focus();
    this.gameTimeSub = timer(0, 100).subscribe(() => {
      const timeNow = new Date().getTime();
      this.userGameTime = timeNow - this.gameStartTime!;
      if (timeNow >= this.gameEndTime!) {
        this.score = this.calculateScore(
          this.quote,
          this.userInput,
          this.userGameTime
        );
        this.endGame();
      }
    });
  }

  endGame(): void {
    this.gameStarted = false;
    this.contentElement.nativeElement.classList.remove('focused');
    this.inputElement.nativeElement.blur();
    this.countdown = 5;
    this.countdownSub?.unsubscribe();
    this.countdownSub = null;
    this.gameTimeSub?.unsubscribe();
    this.gameTimeSub = null;
  }

  resetGame(): void {
    this.score = null;
    this.gameStarted = false;
    this.contentElement.nativeElement.classList.remove('focused');
    this.inputElement.nativeElement.blur();
    this.countdown = 5;
    this.userInput = '';
    this.userGameTime = 0;
    this.gameStartTime = null;
    this.gameEndTime = null;
    this.countdownSub?.unsubscribe();
    this.countdownSub = null;
    this.gameTimeSub?.unsubscribe();
    this.gameTimeSub = null;
  }

  calculateScore(
    quote: string,
    userInput: string,
    userTime: number
  ): {
    userScore: number;
    maxScore: number;
    wpm: number;
    cwpm: number;
  } {
    const splitQuote: string[] = quote.split(' ');
    const splitUserInput: string[] = userInput.split(' ');
    let maxScore: number = 0;
    let userScore: number = 0;
    let correctWords: number = 0;
    splitQuote.forEach((str, i) => {
      if (splitUserInput[i] === str) {
        correctWords++;
        if (str.length <= 3) {
          userScore = userScore + 1;
        } else if (str.length > 3 && str.length <= 7) {
          userScore = userScore + 2;
        } else if (str.length > 7 && str.length <= 11) {
          userScore = userScore + 3;
        } else {
          userScore = userScore + 4;
        }
      }
      if (str.length < 3) {
        maxScore = maxScore + 1;
      } else if (str.length > 3 && str.length < 7) {
        maxScore = maxScore + 2;
      } else if (str.length > 7 && str.length < 11) {
        maxScore = maxScore + 3;
      } else {
        maxScore = maxScore + 4;
      }
    });
    // Words per minute
    const wpm = splitUserInput.length
      ? Math.round((splitUserInput.length / (userTime / 1000)) * 60)
      : 0;
    // Correct words per minute
    const cwpm = Math.round((correctWords / (userTime / 1000)) * 60);
    return { userScore, maxScore, wpm, cwpm };
  }
}
