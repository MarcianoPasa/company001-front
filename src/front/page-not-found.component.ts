import { Component, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-page-not-found',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './page-not-found.component.html',
  styles: [`
    i { vertical-align: middle; }
    h1 { font-size: 6rem; letter-spacing: -2px; opacity: 0.8; }
  `]
})
export class PageNotFoundComponent {
  private readonly location = inject(Location);

  goBack(): void {
    this.location.back();
  }
}
