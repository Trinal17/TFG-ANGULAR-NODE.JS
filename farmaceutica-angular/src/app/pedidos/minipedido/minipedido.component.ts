import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { signal } from '@angular/core';

export interface Pedido {
  _id: string;
  numero_pedido: string;
  cantidad_pedida: number;
  nombre_proveedor?: string;
  nombre_medicamento?: string;
}

@Component({
  selector: 'app-mini-pedido',
  standalone: true,
  templateUrl: './minipedido.component.html',
})
export class MiniPedidoComponent implements OnChanges {
  // Ahora aceptamos null
  @Input() pedido: Pedido | null = null;
  @Output() onClose = new EventEmitter<void>();
  @Output() onSave  = new EventEmitter<{ id: string; cantidad_pedida: number }>();

  // Inicialmente null, lo setearé en ngOnChanges
  cantidad = signal<number | null>(null);

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['pedido'] && this.pedido) {
      // Al cambiar el pedido, inicializamos la señal con la cantidad actual
      this.cantidad.set(this.pedido.cantidad_pedida);
    }
  }
  
  save(): void {
    if (!this.pedido) {
      return; // seguridad extra
    }
    const cant = this.cantidad();
    if (cant == null || isNaN(cant)) {
      return; // podrías emitir un error aquí si quieres
    }
    // Emite el id (con !) y la cantidad
    this.onSave.emit({ id: this.pedido._id, cantidad_pedida: cant });
    this.onClose.emit();
  }
}
