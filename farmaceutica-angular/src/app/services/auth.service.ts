// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import axios from 'axios';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:3000/auth';

  // cambias el nombre de la propiedad para que sea ascii
  login(correo: string, password: string) {
    return axios.post(`${this.apiUrl}/login`, { correo, password });
  }

  updateProfile(
    id: string,
    nombre: string,
    apellidos: string,
    password?: string
  ) {
    // construimos el body dinámicamente
    const body: any = { nombre, apellidos };
    if (password && password.trim() !== '') {
      body.password = password;
    }
    return axios.put(`${this.apiUrl}/profile/${id}`, body);
  }
}
