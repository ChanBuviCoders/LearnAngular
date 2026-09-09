import { Component, computed, effect, signal } from '@angular/core';

type Theme = 'light' | 'dark';

@Component({
  standalone: false,
  selector: 'app-topup-recharge',
  templateUrl: './topup-recharge.component.html',
  styleUrls: ['./topup-recharge.component.css']
})
export class TopupRechargeComponent {
  price = signal(100);
  previousPrice = signal(100);
  lastUpdated = signal('');

  isUp = computed(() => this.price() >= this.previousPrice());

  private timerId: number;

  constructor() {
    // Simulates WebSocket/server data arriving every second
    this.timerId = window.setInterval(() => {
      const newPrice = Math.floor(Math.random() * 100) + 50;

      this.previousPrice.set(this.price());
      this.price.set(newPrice);
      this.lastUpdated.set(new Date().toLocaleTimeString());
    }, 1000);

    // Side effect: log whenever live price changes
    effect(() => {
      console.log('New live price:', this.price());
    });
  }

  stop() {
    clearInterval(this.timerId);
  }

  ngOnDestroy() {
    clearInterval(this.timerId);
  }
}
