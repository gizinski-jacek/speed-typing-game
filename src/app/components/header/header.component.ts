import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Subscription, timer } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Output() start = new EventEmitter<any>();
  @Output() end = new EventEmitter<any>();
  @Output() reset = new EventEmitter<any>();
  countdownSub: Subscription | null = null;
  countdown: number = 5;
  gameStarted: boolean = false;
  gameTimeSub: Subscription | null = null;
  gameTime: number = 60;

  ngOnInit() {}

  ngOnDestroy() {
    this.countdownSub?.unsubscribe();
    this.gameTimeSub?.unsubscribe();
  }

  startCountdown(): void {
    if (this.countdownSub) return;
    this.countdownSub = timer(0, 1000).subscribe(() => {
      const newTime = this.countdown - 1;
      if (this.gameStarted) {
        this.startGameTimer();
      }
      if (newTime) {
        this.countdown = newTime;
      } else {
        this.start.emit();
        this.countdown = newTime;
        this.gameStarted = true;
      }
    });
  }

  startGameTimer(): void {
    this.countdownSub?.unsubscribe();
    this.gameTimeSub = timer(0, 1000).subscribe(() => {
      const newTime = this.gameTime - 1;
      if (newTime) {
        this.gameTime = newTime;
      } else {
        this.end.emit();
        this.gameTimeSub?.unsubscribe();
        this.gameTime = newTime;
      }
    });
  }

  resetGame(): void {
    this.gameStarted = false;
    this.countdown = 5;
    this.gameTime = 60;
    this.countdownSub?.unsubscribe();
    this.gameTimeSub?.unsubscribe();
    this.reset.emit();
  }
}
