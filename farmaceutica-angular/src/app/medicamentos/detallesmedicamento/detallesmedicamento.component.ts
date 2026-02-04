import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MedicamentoService } from '../../services/medicamento.service';

@Component({
  selector: 'app-detalles-medicamento',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './detallesmedicamento.component.html',
})
export class DetallesMedicamentoComponent implements OnInit {
  medicamento       = signal<any | null>(null);
  error             = signal<string | null>(null);

  // En lugar de canvas refs, ahora solo URLs
  pedidosChartUrl: string | null = null;
  ventasChartUrl:  string | null = null;

  constructor(
    private route: ActivatedRoute,
    private service: MedicamentoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.error.set('ID de medicamento no proporcionado');
      return;
    }

    this.service.getMedicamentoById(id)
      .then(res => {
        this.medicamento.set(res.data);
        this.generarChartUrls(res.data);
      })
      .catch(() => {
        this.error.set('No se pudo cargar el medicamento');
      });
  }

  private generarChartUrls(med: any) {
    // 1) Pedidos
    if (Array.isArray(med.pedidos) && med.pedidos.length > 0) {
      const labelsPedidos = med.pedidos.map((p: any) => p.numero_pedido);
      const dataPedidos   = med.pedidos.map((p: any) => p.cantidad_pedida);

      const configPedidos = {
        type: 'doughnut',
        data: {
          labels: labelsPedidos,
          datasets: [{
            data: dataPedidos,
            // Opcional: detalles adicionales (colores, bordes, etc.).
          }]
        },
        options: {
          responsive: true,
          legend: { display: true, position: 'bottom' },
          title: { display: true, text: 'Pedidos por número de pedido' }
        }
      };

      // Montamos la URL de QuickChart (codificando el JSON)
      const encodedConfigPedidos = encodeURIComponent(JSON.stringify(configPedidos));
      this.pedidosChartUrl = `https://quickchart.io/chart?c=${encodedConfigPedidos}&format=png`;
    } else {
      // Si no hay pedidos, mostramos un gráfico simple “Sin datos”
      const configVacío = {
        type: 'doughnut',
        data: {
          labels: ['Sin datos'],
          datasets: [{ data: [1] }]
        },
        options: { responsive: true }
      };
      const encodedConfigVacio = encodeURIComponent(JSON.stringify(configVacío));
      this.pedidosChartUrl = `https://quickchart.io/chart?c=${encodedConfigVacio}&format=png`;
    }

    // 2) Ventas
    if (Array.isArray(med.ventas) && med.ventas.length > 0) {
      const labelsVentas = med.ventas.map((v: any) => v.numero_receta);
      const dataVentas   = med.ventas.map((v: any) => v.cantidad_vendida);

      const configVentas = {
        type: 'doughnut',
        data: {
          labels: labelsVentas,
          datasets: [{
            data: dataVentas,
          }]
        },
        options: {
          responsive: true,
          legend: { display: true, position: 'bottom' },
          title: { display: true, text: 'Ventas por número de receta' }
        }
      };

      const encodedConfigVentas = encodeURIComponent(JSON.stringify(configVentas));
      this.ventasChartUrl = `https://quickchart.io/chart?c=${encodedConfigVentas}&format=png`;
    } else {
      const configVacio2 = {
        type: 'doughnut',
        data: {
          labels: ['Sin datos'],
          datasets: [{ data: [1] }]
        },
        options: { responsive: true }
      };
      const encodedConfigVacio2 = encodeURIComponent(JSON.stringify(configVacio2));
      this.ventasChartUrl = `https://quickchart.io/chart?c=${encodedConfigVacio2}&format=png`;
    }
  }

  goBack(): void {
    this.router.navigate(['/medicamentos']);
  }
}
