// src/app/features/auth/pages/hello/hello.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-hello',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hello.component.html',
})
export class HelloComponent implements OnInit {
  loadingProgress = 0;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.simulateLoading();
  }

  simulateLoading(): void {
    const interval = setInterval(() => {
      this.loadingProgress += 10;
      
      if (this.loadingProgress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          this.router.navigate(['/auth/login']);
        }, 500);
      }
    }, 300);
  }
}