// src/app/services/pedido.service.ts
import { Injectable } from '@angular/core';
import axios from 'axios';

export interface Pedido {
  _id: string;
  numero_pedido: string;
  nombre_medicamento: string;
  cantidad_pedida: number;
  codigo_proveedor: string;
  nombre_proveedor?: string;
}

@Injectable({ providedIn: 'root' })
export class PedidoService {
  private apiUrl = 'http://localhost:3000/pedidos';
  getPedidos() {
    return axios.get<Pedido[]>(this.apiUrl);
  }
  getPedidoByNumero(numero: string) {
    return axios.get(`${this.apiUrl}/numero/${numero}`);
  }
  addPedido(data: Omit<Pedido, '_id' | 'nombre_proveedor'>) {
    return axios.post(this.apiUrl, data);
  }
  updatePedido(id: string, cantidad_pedida: number) {
    return axios.put(`${this.apiUrl}/${id}`, { cantidad_pedida });
  }
  deletePedido(id: string) {
    return axios.delete(`${this.apiUrl}/${id}`);
  }
}
