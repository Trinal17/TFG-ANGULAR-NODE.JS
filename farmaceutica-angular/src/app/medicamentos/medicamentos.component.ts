import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MedicamentoService } from '../services/medicamento.service';
import { AuthStorageService } from '../services/storage.service';
import { MiniMedicamentoComponent } from './minimedicamentos/minimedicamentos.component';
import { jsPDF } from 'jspdf'; // Importar jsPDF
import autoTable from 'jspdf-autotable'; // Importar el plugin de autoTable

@Component({
  selector: 'app-medicamentos',
  standalone: true,
  imports: [CommonModule, MiniMedicamentoComponent, RouterLink],
  templateUrl: './medicamentos.component.html',
  styleUrls: ['./medicamentos.component.css']
})
export class MedicamentosComponent implements OnInit {
  // lista y selección
  medicamentos        = signal<any[]>([]);
  selectedMedicamento = signal<any | null>(null);
  lowStockWarning = signal<string | null>(null);

  // ---- FILTROS ----
  filterName = signal('');
  filterType = signal('');

  // paginación
  readonly pageSize   = 6;
  currentPage         = signal(1);

  // lista después de aplicar filtros
  filteredMedicamentos = computed(() => {
    const name = this.filterName().toLowerCase();
    const type = this.filterType();
    return this.medicamentos()
      .filter(m => m.nombre.toLowerCase().includes(name))
      .filter(m => !type || m.tipo === type);
  });

  // tipos únicos para el dropdown
  tipos = computed(() => {
    const set = new Set(this.medicamentos().map(m => m.tipo));
    return Array.from(set);
  });

  // total páginas según lista filtrada
  totalPages = computed(() =>
    Math.ceil(this.filteredMedicamentos().length / this.pageSize)
  );
  pages = computed(() =>
    Array.from({ length: this.totalPages() }, (_, i) => i + 1)
  );
  // slice sobre la lista filtrada
  pagedMedicamentos = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize;
    return this.filteredMedicamentos().slice(start, start + this.pageSize);
  });

  constructor(
    private srv: MedicamentoService,
    public auth: AuthStorageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchMedicamentos();
  }

  /** Trae la lista desde el backend */
  fetchMedicamentos(): void {
  this.srv.getMedicamentos()
    .then(res => {
      const meds = res.data as Array<{ nombre: string; cantidad: number; stock_minimo: number }>;
      this.medicamentos.set(meds);
      this.auth.setMedicamentos(meds);

      // Filtra los de bajo stock y extrae sus nombres
      const lowNames = meds
        .filter((m: { cantidad: number; stock_minimo: number }) => m.cantidad <= m.stock_minimo)
        .map((m: { nombre: string }) => m.nombre);

      // Genera un único mensaje o null
      if (lowNames.length === 1) {
        this.lowStockWarning.set(`Stock mínimo en el medicamento ${lowNames[0]}.`);
      } else if (lowNames.length > 1) {
        this.lowStockWarning.set(
          `Stock mínimo en varios medicamentos, por favor revise: ${lowNames.join(', ')}.`
        );
      } else {
        this.lowStockWarning.set(null);
      }
    })
    .catch(err => console.error('Error cargando medicamentos', err));
}

  // navegación de páginas
  goToPage(page: number): void {
    this.currentPage.set(page);
  }
  prevPage(): void {
    if (this.currentPage() > 1) {
      this.currentPage.set(this.currentPage() - 1);
    }
  }
  nextPage(): void {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.set(this.currentPage() + 1);
    }
  }

  // abrir formulario de creación
  goToNuevo(): void {
    this.router.navigate(['/nuevo-medicamento']);
  }

  // modal de actualizar
  openUpdateModal(med: any): void {
    this.selectedMedicamento.set(med);
  }
  closeModal(): void {
    this.selectedMedicamento.set(null);
  }

  actualizarMedicamentoActualizado(data: { id: string; cantidad: number; numeroPedido: string }) {
    this.srv.actualizarMedicamento(data.id, data.cantidad, data.numeroPedido)
      .then(res => {
        const updated = res.data;
        this.auth.updateMedicamentoLocal(updated);
        this.medicamentos.set(this.auth.medicamentos());
      })
      .catch(console.error);
    this.closeModal();
  }

  goToDetails(id: string): void {
    this.router.navigate(['/medicamentos', id]);
  }

   // reset página al cambiar filtro
  onNameFilter(value: string) {
    this.filterName.set(value);
    this.currentPage.set(1);
  }
  onTypeFilter(value: string) {
    this.filterType.set(value);
    this.currentPage.set(1);
  }

  /** Genera un PDF con la página actual de la tabla */
  exportPdf(): void {
    const doc = new jsPDF();
    doc.text('Listado de Medicamentos', 14, 16);

    // columnas
    const columns = ['Nombre', 'Ubicación', 'Tipo', 'Cantidad'];

    // filas: usa **filteredMedicamentos**, no solo la página actual
    const rows = this.filteredMedicamentos().map(med => [
      med.nombre,
      med.ubicacion,
      med.tipo,
      med.cantidad
    ]);

    autoTable(doc, {
      head: [columns],
      body: rows,
      startY: 20,
      theme: 'striped',
      styles: { fontSize: 10 }
    });

    doc.save('inventario_medicamentos.pdf');
  }

  //Borrar medicamento
  deleteMedicamento(id: string): void {
    if (confirm('¿Estás seguro de que quieres eliminar este medicamento?')) {
      this.srv.deleteMedicamento(id)
        .then(() => {
          this.medicamentos.set(this.medicamentos().filter(med => med._id !== id));
          this.srv.deleteMedicamento(id);
        })
        .catch(err => console.error('Error al eliminar medicamento:', err));
    }
  }

}
