import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Subscription, timer } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Input() btnDisabled: boolean = false;
  @Input() gameStarted: boolean = false;
  @Input() timeLeft: number | null = null;
  @Output() confirmEvent = new EventEmitter();
  @Output() startEvent = new EventEmitter();
  @Output() resetEvent = new EventEmitter();
  @Input() showControls: boolean = false;
  difficulty: string = 'easy';
  countdownSub: Subscription | null = null;
  countdown: number = 5;

  constructor() {}

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.countdownSub?.unsubscribe();
  }

  changeDifficulty(e: Event): void {
    const { value } = e.target as HTMLSelectElement;
    this.difficulty = value;
  }

  confirmDifficulty(): void {
    this.resetCountdown();
    this.confirmEvent.emit(this.difficulty);
  }

  startCountdown(): void {
    if (this.countdownSub) return;
    this.resetCountdown();
    this.countdownSub = timer(0, 1000).subscribe(() => {
      const newTime = this.countdown - 1;
      if (newTime > 0) {
        this.countdown = newTime;
      } else {
        this.countdownSub?.unsubscribe();
        this.countdownSub = null;
        this.startEvent.emit();
      }
    });
  }

  startEmit(): void {
    this.startEvent.emit();
  }

  resetCountdown(): void {
    this.countdown = 5;
    this.countdownSub?.unsubscribe();
    this.countdownSub = null;
    this.resetEvent.emit();
  }

  resetEmit(): void {
    this.resetEvent.emit();
  }
}
