import { Injectable } from '@angular/core';
import axios from 'axios';

export type Turno = 'M' | 'T' | 'L';

export interface IEmpleado {
  _id: string;
  nombre: string;
  apellidos: string;
  telefono: string;
  correo: string;
  /** Array de 12 meses, cada uno con un mapa día→Turno */
  calendario: Array<{ days: Record<string, Turno> }>;
}

@Injectable({ providedIn: 'root' })
export class EmpleadoService {
  private apiUrl = 'http://localhost:3000/empleados';

  getEmpleados() {
    return axios.get<IEmpleado[]>(this.apiUrl);
  }

  /**
   * Actualiza un único día en el calendario del empleado
   * @param id        _id del empleado
   * @param mes       índice de mes 0–11
   * @param dia       número de día 1–31
   * @param turno     'M'|'T'|'L'
   */
  updateEmpleadoCalendario(
    id: string,
    mes: number,
    dia: number,
    turno: Turno
  ) {
    return axios.put(
      `${this.apiUrl}/${id}/calendario`,
      { mes, dia, turno }
    );
  }
}
