// src/app/services/proveedor.service.ts
import { Injectable } from '@angular/core';
import axios from 'axios';
import { Pedido } from './pedido.service';

export interface Proveedor {
  _id: string;
  codigo: string;
  nombre: string;
  direccion: string;
  telefono: string;
  email: string;
  pedidos: Pedido[];
}

export interface PedidoSub {
  numero_pedido: string;
  nombre_medicamento: string;
  cantidad_pedida: number;
}

@Injectable({ providedIn: 'root' })
export class ProveedorService {
  private apiUrl = 'http://localhost:3000/proveedores';
  getProveedores() {
    return axios.get<Proveedor[]>(this.apiUrl);
  }
  addPedidoToProveedor(
    codigo: string,
    pedido: PedidoSub
  ) {
    return axios.post(
      `${this.apiUrl}/${codigo}/pedidos`,
      pedido
    );
  }
  removePedidoFromProveedor(codigo: string, numero: string) {
    return axios.delete(
      `${this.apiUrl}/${codigo}/pedidos/${numero}`
    );
  }
  updatePedidoInProveedor(
    codigo: string,
    numero_pedido: string,
    cantidad_pedida: number
  ) {
    return axios.put(
      `${this.apiUrl}/${codigo}/pedidos/${numero_pedido}`,
      { cantidad_pedida }
    );
  }
}
