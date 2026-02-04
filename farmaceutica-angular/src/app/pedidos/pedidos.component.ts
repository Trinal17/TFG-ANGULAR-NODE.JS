import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PedidoService, Pedido } from '../services/pedido.service';
import { ProveedorService, Proveedor } from '../services/proveedor.service';
import { MiniPedidoComponent } from './minipedido/minipedido.component';
import { MedicamentoService } from '../services/medicamento.service';
import { AuthStorageService } from '../services/storage.service';

@Component({
  selector: 'app-pedidos',
  standalone: true,
  imports: [CommonModule, RouterLink, MiniPedidoComponent],
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.css']
})
export class PedidosComponent implements OnInit {
  pedidos = signal<Pedido[]>([]);
  proveedores = signal<Proveedor[]>([]);
  medicamentos = signal<any[]>([]);
  selected = signal<Pedido | null>(null);

  // ─── FILTROS ────────────────────────────────────────────────────────────────
  filterMedName = signal('');
  filterProvider = signal('');

  // ─── PAGINACIÓN ────────────────────────────────────────────────────────────
  readonly pageSize = 8;
  currentPage = signal(1);

  // lista filtrada
  filteredPedidos = computed(() => {
    const name = this.filterMedName().toLowerCase();
    const provCode = this.filterProvider();
    return this.pedidos()
      .filter(p => p.nombre_medicamento.toLowerCase().includes(name))
      .filter(p => !provCode || p.codigo_proveedor === provCode);
  });

  // únicos proveedores para dropdown
  providerOptions = computed(() => {
    const filtrarProvs = new Set<string>();
    return this.proveedores()
      .filter(pr => {
        if (filtrarProvs.has(pr.codigo)) return false;
        filtrarProvs.add(pr.codigo);
        return true;
      });
  });

  // cálculo de páginas sobre la lista filtrada
  totalPages = computed(() =>
    Math.ceil(this.filteredPedidos().length / this.pageSize)
  );
  pages = computed(() =>
    Array.from({ length: this.totalPages() }, (_, i) => i + 1)
  );
  pagedPedidos = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize;
    return this.filteredPedidos().slice(start, start + this.pageSize);
  });

  constructor(
    private pedidoSrv: PedidoService,
    private provSrv: ProveedorService,
    private medSrv: MedicamentoService,
    public auth: AuthStorageService
  ) { }

  ngOnInit(): void {
    // carga inicial
    this.pedidoSrv.getPedidos()
      .then(res => this.pedidos.set(res.data))
      .catch(err => console.error('Error cargando pedidos', err));
    this.provSrv.getProveedores()
      .then(res => this.proveedores.set(res.data))
      .catch(err => console.error('Error cargando proveedores', err));
    this.medSrv.getMedicamentos()
      .then(res => this.medicamentos.set(res.data))
      .catch(err => console.error('Error cargando medicamentos', err));
  }

  // apertura y cierre de modal…
  openEdit(p: Pedido): void {
    const numero = String(p.numero_pedido).trim();

    // Comprueba si existe en algún medicamento
    const yaAsignado = this.medicamentos().some(med =>
      (med.pedidos || []).some((pd: any) =>
        String(pd.numero_pedido).trim() === numero
      )
    );

    if (yaAsignado) {
      alert('No se puede editar este pedido porque ya está asignado a un medicamento.');
      return;    // no hacemos this.selected.set(p)
    }

    // Sólo si no está asignado abrimos el modal
    this.selected.set(p);
  }

  closeEdit(): void { this.selected.set(null); }

  onUpdate(event: { id: string; cantidad_pedida: number }): void {
  this.pedidoSrv.updatePedido(event.id, event.cantidad_pedida)
    .then(res => {
      const updated = res.data as Pedido;
      return this.pedidoSrv.getPedidos()
        .then(r => {
          this.pedidos.set(r.data);
          return updated;
        });
    })
    .then(updated => {
      const codigoProv = updated.codigo_proveedor!;
      // llamamos al PUT ahora
      return this.provSrv.updatePedidoInProveedor(
        codigoProv,
        updated.numero_pedido,
        event.cantidad_pedida
      );
    })
    .then(() => this.provSrv.getProveedores().then(r => this.proveedores.set(r.data)))
    .catch(err => console.error('Error sincronizando con proveedor:', err))
    .finally(() => this.closeEdit());
}


  onDelete(id: string): void {
    // 1) Buscamos el pedido en la lista
    const pedido = this.pedidos().find(p => p._id === id);
    if (!pedido) return;

    const numero = pedido.numero_pedido!;
    const codigo = pedido.codigo_proveedor!;
    if (pedido) {
      const numero = pedido.numero_pedido;
      // 2) Comprobamos en todos los medicamentos
      const yaAsignado = this.medicamentos().some(med =>
        (med.pedidos || []).some((pd: any) => pd.numero_pedido === numero)
      );
      if (yaAsignado) {
        // Si está asignado, no dejamos borrar
        alert('No se puede eliminar este pedido porque ya está asignado a un medicamento.');
        return;
      }
    }

    // 3) Si no está asignado, pedimos confirmación y borramos
    if (confirm('¿Cancelar este pedido?')) {
      // 4) Primero borrarlo del proveedor
      this.provSrv.removePedidoFromProveedor(codigo, numero)
        .catch(err => console.error('Error borrando del proveedor', err))
        .finally(() => {
          // 5) Luego borrarlo de la colección de pedidos
          this.pedidoSrv.deletePedido(id)
            .then(() => this.pedidoSrv.getPedidos().then(r => this.pedidos.set(r.data)))
            .catch(err => console.error('Error eliminando pedido', err));
        });
    }
  }

  // ─── CONTROLES DE FILTRO ────────────────────────────────────────────────────
  onNameFilter(value: string): void {
    this.filterMedName.set(value);
    this.currentPage.set(1);
  }
  onProviderFilter(value: string): void {
    this.filterProvider.set(value);
    this.currentPage.set(1);
  }

  // ─── NAV PÁGINAS ────────────────────────────────────────────────────────────
  goToPage(p: number): void { this.currentPage.set(p); }
  prevPage(): void { if (this.currentPage() > 1) this.currentPage.set(this.currentPage() - 1); }
  nextPage(): void { if (this.currentPage() < this.totalPages()) this.currentPage.set(this.currentPage() + 1); }
}
