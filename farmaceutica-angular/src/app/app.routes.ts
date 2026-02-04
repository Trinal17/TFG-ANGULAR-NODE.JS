import { Routes } from '@angular/router';
import { InicioComponent } from './inicio/inicio.component';
import { LoginComponent } from './login/login.component';
import { PrincipalComponent } from './principal/principal.component';
import { MedicamentosComponent } from './medicamentos/medicamentos.component';
import { DetallesMedicamentoComponent } from './medicamentos/detallesmedicamento/detallesmedicamento.component';
import { authGuard } from './guards/auth.guard';
import { NuevoMedicamentoComponent } from './medicamentos/nuevomedicamento/nuevomedicamento.component';
import { PedidosComponent } from './pedidos/pedidos.component';
import { NuevoPedidoComponent } from './pedidos/nuevopedido/nuevopedido.component';
import { PerfilComponent } from './perfil/perfil.component';
import { HorarioComponent } from './horario/horario.component';

export const routes: Routes = [
  { path: '', component: InicioComponent },
  { path: 'login', component: LoginComponent },
  { path: 'principal', component: PrincipalComponent, canActivate: [authGuard] },
  { path: 'medicamentos', component: MedicamentosComponent, canActivate: [authGuard] },
  { path: 'medicamentos/:id', component: DetallesMedicamentoComponent, canActivate: [authGuard] },
  {
    path: 'nuevo-medicamento',
    component: NuevoMedicamentoComponent,
    canActivate: [authGuard],
    data: { roles: ['Gerente'] }
  },
  { path: 'pedidos',           component: PedidosComponent,    canActivate: [authGuard] },
  {
    path: 'nuevo-pedido',
    component: NuevoPedidoComponent,
    canActivate: [authGuard],
    data: { roles: ['Gerente'] }
  },
  { path: 'perfil', component: PerfilComponent, canActivate: [authGuard] },
  { path: 'horario', component: HorarioComponent, canActivate: [authGuard], data: { roles: ['Gerente'] } },
  { path: '**', redirectTo: '' }
];
