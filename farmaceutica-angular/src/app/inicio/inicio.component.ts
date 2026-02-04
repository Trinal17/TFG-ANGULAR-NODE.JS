import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthStorageService } from '../services/storage.service';

@Component({
  selector: 'app-inicio',
  standalone: true,
  templateUrl: './inicio.component.html',
})
export class InicioComponent {
  constructor(
    private router: Router,
    public authStorage: AuthStorageService
  ) {
    if (this.authStorage.isUserLoggedIn()) {
      this.router.navigate(['/principal']);
    }
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}
