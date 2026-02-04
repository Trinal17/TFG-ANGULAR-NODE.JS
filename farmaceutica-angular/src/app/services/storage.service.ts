// src/app/services/storage.service.ts
import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthStorageService {
  // ────────────────────────────────────────────────────────────────────────────
  // ── User Session Management ─────────────────────────────────────────────────
  // ────────────────────────────────────────────────────────────────────────────

  private readonly USER_KEY = 'userData';

  user = signal<Record<string, any> | null>(this.readUser());

  private readUser(): Record<string, any> | null {
    const s = sessionStorage.getItem(this.USER_KEY);
    return s ? JSON.parse(s) : null;
  }

  setUser(userData: Record<string, any>): void {
    sessionStorage.setItem(this.USER_KEY, JSON.stringify(userData));
    this.user.set(userData);
  }

  clearUser(): void {
    sessionStorage.removeItem(this.USER_KEY);
    this.user.set(null);
  }

  isUserLoggedIn(): boolean {
    return this.user() !== null;
  }

  getUser(): Record<string, any> | null {
    return this.user();
  }

  // ────────────────────────────────────────────────────────────────────────────
  // ── Medicamentos Local Cache ────────────────────────────────────────────────
  // ────────────────────────────────────────────────────────────────────────────

  private readonly MEDS_KEY = 'medicamentosData';
  /** Señal que contiene la lista de medicamentos en localStorage */
  medicamentos = signal<any[]>(this.readMedsFromLocal());

  /** Lee la lista de medicamentos de localStorage */
  private readMedsFromLocal(): any[] {
    const stored = localStorage.getItem(this.MEDS_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  /** Guarda la lista completa de medicamentos en localStorage */
  setMedicamentos(medicamentosData: any[]): void {
    localStorage.setItem(this.MEDS_KEY, JSON.stringify(medicamentosData));
    this.medicamentos.set(medicamentosData);
  }

  /** Actualiza un único medicamento en el cache local */
  updateMedicamentoLocal(updated: any): void {
    const list = this.medicamentos();
    const newList = list.map(m => m._id === updated._id ? updated : m);
    this.setMedicamentos(newList);
  }

}
