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
  gameStarted: boolean = false;
  countdownSub: Subscription | null = null;
  countdown: number = 5;
  gameTimeSub: Subscription | null = null;
  gameTime: number | undefined = undefined;
  userGameTime: number = 0;
  score: { userScore: number; maxScore: number } | null = null;

  constructor(private http: HttpService) {}

  ngOnInit(): void {
    this.http.getRandomQuote().subscribe((res) => {
      this.quote = res.content;
      this.gameTime = Math.round(res.content.length / 5);
    });
  }

  ngOnDestry(): void {
    this.countdownSub?.unsubscribe();
    this.gameTimeSub?.unsubscribe();
  }

  inputChange(input: any): void {
    this.userInput = input;
    if (this.gameStarted && this.userInput.length >= this.quote.length) {
      this.score = this.score = this.calculateScore(
        this.quote,
        this.userInput,
        Math.round(this.quote.length / 5 - this.gameTime!)
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
    this.countdownSub?.unsubscribe();
    this.countdownSub = null;
    this.gameStarted = true;
    this.contentElement.nativeElement.classList.add('focused');
    this.inputElement.nativeElement.focus();
    this.gameTimeSub = timer(0, 1000).subscribe(() => {
      const newTime = this.gameTime! - 1;
      if (newTime >= 0) {
        this.gameTime = newTime;
      } else {
        this.score = this.calculateScore(
          this.quote,
          this.userInput,
          Math.round(this.quote.length / 5 - this.gameTime!)
        );
        this.endGame();
      }
    });
  }

  endGame(): void {
    this.contentElement.nativeElement.classList.remove('focused');
    this.inputElement.nativeElement.blur();
    this.countdown = 5;
    this.gameStarted = false;
    this.userGameTime = Math.round(this.quote.length / 5 - this.gameTime!);
    this.countdownSub?.unsubscribe();
    this.countdownSub = null;
    this.gameTimeSub?.unsubscribe();
    this.gameTimeSub = null;
  }

  resetGame(): void {
    this.userInput = '';
    this.userGameTime = 0;
    this.gameTime = Math.round(this.quote.length / 5);
    this.endGame();
  }

  calculateScore(
    quote: string,
    userInput: string,
    userTime: number
  ): { userScore: number; maxScore: number } {
    const splitQuote: string[] = quote.split(' ');
    const splitUserInput: string[] = userInput.split(' ');
    let maxScore: number = 0;
    let userScore: number = 0;
    splitQuote.forEach((str, i) => {
      if (splitUserInput[i] === str) {
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
    if (userScore === maxScore) {
      userScore = userScore + userTime * 5;
    }
    return { userScore, maxScore };
  }
}
