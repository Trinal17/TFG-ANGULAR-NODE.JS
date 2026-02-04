import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthStorageService } from '../services/storage.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  constructor(
    public authStorage: AuthStorageService,
    private router: Router
  ) {}

  logout(): void {
    this.authStorage.clearUser();
    this.router.navigate(['/']);
  }
}
