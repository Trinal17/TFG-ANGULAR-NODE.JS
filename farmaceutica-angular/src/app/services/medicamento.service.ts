import { Injectable } from '@angular/core';
import axios from 'axios';

export interface NuevoMedicamento {
  nombre: string;
  ubicacion: string;
  cantidad: number;
  tipo: string;
  descripcion?: string;
  ingredientes?: string[];
  pedidos?: any[]; // inicialmente vacío
  ventas?: any[];  // inicialmente vacío
}

@Injectable({
  providedIn: 'root'
})
export class MedicamentoService {
  private apiUrl = 'http://localhost:3000/medicamentos';

  getMedicamentos() {
    return axios.get(this.apiUrl);
  }

  actualizarMedicamento(id: string, cantidad: number, numeroPedido: string) {
    return axios.put(`${this.apiUrl}/${id}`, { cantidad, numeroPedido });
  }

  getMedicamentoById(id: string) {
    return axios.get(`${this.apiUrl}/${id}`);
  }

  addMedicamento(data: NuevoMedicamento) {
    return axios.post(this.apiUrl, data);
  }

  deleteMedicamento(id: string) {
    return axios.delete(`${this.apiUrl}/${id}`);
  }
}
