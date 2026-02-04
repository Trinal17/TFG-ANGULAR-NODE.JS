// src/app/login/login.component.ts
import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AuthStorageService } from '../services/storage.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  email    = signal<string>('');
  password = signal<string>('');
  error    = signal<string>('');

  constructor(
    private authSvc: AuthService,
    private storage: AuthStorageService,
    private router:  Router
  ) {
    // Limpia sesión al cargar el login
    this.storage.clearUser();
  }

  login(): void {
    const correo   = this.email();
    const pass     = this.password();

    this.authSvc.login(correo, pass)
      .then(res => {
        this.error.set('');
        this.storage.setUser(res.data);
        this.router.navigate(['/principal']);
      })
      .catch(err => {
        this.error.set(
          err.response?.data?.message
          || 'Usuario o contraseña incorrectos'
        );
      });
  }
}
