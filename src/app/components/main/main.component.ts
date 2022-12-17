import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Subscription, timer } from 'rxjs';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {
  @ViewChild('inputElement') inputElement: ElementRef<HTMLInputElement> | null =
    null;
  @ViewChild('contentElement')
  contentElement: ElementRef<HTMLDivElement> | null = null;
  @ViewChild('containerElement')
  containerElement: ElementRef<HTMLElement> | null = null;
  quote: string = '';
  userInput: string = '';
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
    accuracy: number;
  } | null = null;
  difficulty: string | null = null;

  constructor(private http: HttpService) {}

  ngOnInit(): void {}

  ngOnDestry(): void {
    this.gameTimeSub?.unsubscribe();
  }

  inputChange(input: string): void {
    this.userInput = input;
    const sameCharacterLength = this.userInput.length >= this.quote.length;
    const userInputWords = this.userInput.split(' ');
    const quoteWords = this.quote.split(' ');
    const sameWordLength = userInputWords.length > quoteWords.length;
    const lastWord =
      userInputWords[userInputWords.length - 1] ===
      quoteWords[quoteWords.length - 1];
    if (
      this.gameStartTime &&
      (sameCharacterLength || sameWordLength || lastWord)
    ) {
      this.userGameTime = new Date().getTime() - this.gameStartTime;
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
    this.contentElement?.nativeElement.classList.add('focused');
    this.inputElement?.nativeElement.focus();
  }

  inputUnfocus(e: MouseEvent): void {
    e.stopPropagation();
    this.contentElement?.nativeElement.classList.remove('focused');
    this.inputElement?.nativeElement.blur();
  }

  ngOnDestroy(): void {
    this.gameTimeSub?.unsubscribe();
  }

  startGameTimer(): void {
    this.gameStarted = true;
    this.gameStartTime = new Date().getTime();
    this.gameEndTime = new Date().getTime() + (this.quote.length / 3) * 1000;
    this.contentElement?.nativeElement.classList.add('focused');
    this.contentElement?.nativeElement.classList.remove('disabled');
    this.inputElement?.nativeElement.focus();
    this.gameTimeSub = timer(0, 100).subscribe(() => {
      if (!this.gameStartTime || !this.gameEndTime) {
        this.endGame();
        return;
      }
      const timeNow = new Date().getTime();
      this.userGameTime = timeNow - this.gameStartTime;
      if (timeNow >= this.gameEndTime) {
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
    this.contentElement?.nativeElement.classList.remove('focused');
    this.contentElement?.nativeElement.classList.add('disabled');
    this.inputElement?.nativeElement.blur();
    this.gameTimeSub?.unsubscribe();
    this.gameTimeSub = null;
  }

  resetGame(): void {
    this.score = null;
    this.gameStarted = false;
    this.contentElement?.nativeElement.classList.remove('focused');
    this.contentElement?.nativeElement.classList.add('disabled');
    this.inputElement?.nativeElement.blur();
    this.userInput = '';
    this.userGameTime = 0;
    this.gameStartTime = null;
    this.gameEndTime = null;
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
    accuracy: number;
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
      if (str.length <= 3) {
        maxScore = maxScore + 1;
      } else if (str.length > 3 && str.length <= 7) {
        maxScore = maxScore + 2;
      } else if (str.length > 7 && str.length <= 11) {
        maxScore = maxScore + 3;
      } else {
        maxScore = maxScore + 4;
      }
    });
    // Words per minute.
    const wpm = splitUserInput.filter((s) => s).length
      ? Math.round((splitUserInput.length / (userTime / 1000)) * 60)
      : 0;
    // Correct words per minute.
    const cwpm = Math.round((correctWords / (userTime / 1000)) * 60);
    // % accuracy.
    const accuracy = (correctWords / splitQuote.length) * 100;
    return { userScore, maxScore, wpm, cwpm, accuracy };
  }

  changeDifficulty(value: string): void {
    this.resetGame();
    this.difficulty = value;
    this.http
      .getRandomQuote(this.difficulty)
      .subscribe((res) => (this.quote = res.content));
  }
}
