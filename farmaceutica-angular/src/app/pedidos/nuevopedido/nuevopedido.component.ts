// src/app/pedidos/nuevo-pedido.component.ts
import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { PedidoService } from '../../services/pedido.service';
import { ProveedorService } from '../../services/proveedor.service';

@Component({
  selector: 'app-nuevo-pedido',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './nuevopedido.component.html',
})
export class NuevoPedidoComponent implements OnInit {
  numeroPedido      = signal('');
  nombreMedicamento = signal('');
  cantidadPedida    = signal<number | null>(null);
  proveedorCodigo   = signal('');
  proveedores       = signal<any[]>([]);
  error             = signal('');

  constructor(
    private pedidoSrv: PedidoService,
    private provSrv:   ProveedorService,
    public router:    Router
  ) {}

  ngOnInit(): void {
    // Carga sencilla de /proveedores
    this.provSrv.getProveedores()
      .then(res => this.proveedores.set(res.data))
      .catch(() => this.error.set('No se pudieron cargar proveedores'));
  }

  /** Genera un string de 6 dígitos; si ya existe en BD, intenta de nuevo */
  private async generarNumeroPedido(): Promise<string> {
    const num = Math.floor(100000 + Math.random() * 900000).toString();
    try {
      await this.pedidoSrv.getPedidoByNumero(num);
      // Si no lanza 404, existe: volvemos a intentar
      return this.generarNumeroPedido();
    } catch (err: any) {
      if (err.response?.status === 404) {
        return num;  // libre: lo devolvemos
      }
      // otro error (p.ej. servidor down), lo propagamos
      throw err;
    }
  }

  /** Maneja el envío del formulario */
  async submit(): Promise<void> {
    this.error.set('');

    // Validación de los campos que el usuario sí rellena
    if (
      !this.nombreMedicamento() ||
      this.cantidadPedida() == null ||
      !this.proveedorCodigo()
    ) {
      this.error.set('Rellena todos los campos.');
      return;
    }

    try {
      // 1) Generar un número único de 6 dígitos
      const numeroPedido = await this.generarNumeroPedido();

      // 2) Enviar al back
      await this.pedidoSrv.addPedido({
        numero_pedido:      numeroPedido,
        nombre_medicamento: this.nombreMedicamento(),
        cantidad_pedida:    this.cantidadPedida()!,
        codigo_proveedor:   this.proveedorCodigo()
      });

      // 3) añadir el pedido al proveedor
      await this.provSrv.addPedidoToProveedor(
      this.proveedorCodigo(),
      {
        numero_pedido: numeroPedido,
        nombre_medicamento: this.nombreMedicamento(),
        cantidad_pedida: this.cantidadPedida()!
      }
    );

      // 4) Redirigir
      this.router.navigate(['/pedidos']);
    } catch {
      this.error.set('Error al crear pedido.');
    }
  }
}
