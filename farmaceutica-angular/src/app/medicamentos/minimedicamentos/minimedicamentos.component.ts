// src/app/medicamentos/minimedicamentos/minimedicamentos.component.ts
import { Component, Input, Output, EventEmitter, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { signal } from '@angular/core';
import { PedidoService } from '../../services/pedido.service';
import { MedicamentoService } from '../../services/medicamento.service';

@Component({
  selector: 'app-minimedicamento',
  standalone: true,
  templateUrl: './minimedicamentos.component.html',
})
export class MiniMedicamentoComponent {
  @Input() medicamento: any = null;
  @Output() onClose = new EventEmitter<void>();
  @Output() onUpdate = new EventEmitter<{ id: string; cantidad: number; numeroPedido: string }>();

  numeroPedido = signal<string | null>(null);
  cantidad = signal<number | null>(null);
  errorMessage = signal('');

  constructor(private pedidoSrv: PedidoService, private medicamentoSrv: MedicamentoService) { }

  isValido(): boolean {
    const s = this.numeroPedido()?.toString() ?? '';
    return s.length === 4;
  }

  isValidNumero(pedido: string): boolean {
    return /^\d{4}$/.test(pedido) || /^\d{6}$/.test(pedido);
  }

  confirmar(): void {
    this.errorMessage.set('');
    const num = this.numeroPedido();
    const numStr = num?.toString() ?? '';

    if (!this.isValidNumero(numStr)) {
      this.errorMessage.set('Introduce un número de pedido válido (4 o 6 dígitos).');
      return;
    }

    // --- PEDIDO (6 dígitos) ---
    if (numStr.length === 6) {
      this.pedidoSrv.getPedidoByNumero(numStr)
        .then(res => {
          const pedido = res.data;
          // Comprueba si ya aplicaste este pedido
          const pedidoYaAñadido = (this.medicamento.pedidos || [])
            .some((p: any) => p.numero_pedido === numStr);
          if (pedidoYaAñadido) {
            this.errorMessage.set('Este pedido ya ha sido aplicado.');
            return;
          }
          // Extrae la cantidad real del pedido
          const cantPed = pedido.cantidad_pedida;
          this.onUpdate.emit({
            id: this.medicamento._id,
            cantidad: cantPed,
            numeroPedido: num!
          });
          this.onClose.emit();
        })
        .catch(err => {
          if (err.response?.status === 404) {
            this.errorMessage.set('Pedido no encontrado.');
          } else {
            this.errorMessage.set('Error comprobando el pedido.');
          }
        });
      return;
    }

    // --- VENTA (4 dígitos) ---
    if (numStr.length === 4) {
      this.medicamentoSrv.getMedicamentoById(this.medicamento._id)
        .then(res => {
          const med = res.data;
          // Comprueba si ya aplicaste esta venta
          const ventaYaAñadida = (med.ventas || [])
            .some((v: any) => v.numero_receta === numStr);
          if (ventaYaAñadida) {
            this.errorMessage.set('Esta receta ya ha sido aplicada.');
            return;
          }
          // Extrae la cantidad escrita por el usuario para la venta
          const cant = this.cantidad();
          if (cant == null || isNaN(cant)) {
            this.errorMessage.set('Introduce una cantidad válida.');
            return;
          }
          this.onUpdate.emit({
            id: this.medicamento._id,
            cantidad: cant,
            numeroPedido: num!
          });
          this.onClose.emit();
        })
    }


  }
}
