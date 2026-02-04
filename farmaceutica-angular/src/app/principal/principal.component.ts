import { Component, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthStorageService } from '../services/storage.service';
import { MedicamentoService } from '../services/medicamento.service';
import { PedidoService } from '../services/pedido.service';

@Component({
  selector: 'app-principal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './principal.component.html',
})
export class PrincipalComponent implements OnInit {
  // Señales para los contadores
  medCount = signal(0);
  pedCount = signal(0);

  constructor(
    public authStorage: AuthStorageService,
    private router: Router,
    private medSvc: MedicamentoService,
    private pedSvc: PedidoService
  ) {
    if (!this.authStorage.isUserLoggedIn()) {
      this.router.navigate(['/']);
    }
  }
  

  ngOnInit(): void {
    // Carga el número de medicamentos
    this.medSvc.getMedicamentos()
      .then(res => this.medCount.set(res.data.length))
      .catch(() => this.medCount.set(0));

    // Carga el número de pedidos
    this.pedSvc.getPedidos()
      .then(res => this.pedCount.set(res.data.length))
      .catch(() => this.pedCount.set(0));
  }

  goToMedicamentos(): void {
    this.router.navigate(['/medicamentos']);
  }

  goToPedidos(): void {
    this.router.navigate(['/pedidos']);
  }

  goToHorarios(): void {
    this.router.navigate(['/horario']);
  }
}
