import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MedicamentoService } from '../../services/medicamento.service';
import { AuthStorageService } from '../../services/storage.service';
import { RouterLink, Router } from '@angular/router';

@Component({
    selector: 'app-nuevo-medicamento',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './nuevomedicamento.component.html',
})
export class NuevoMedicamentoComponent {
    // Campos obligatorios
    nombre = signal('');
    ubicacion = signal('');
    tipo = signal('');
    descripcion = signal('');
    // Ingredientes dinámicos
    ingredientes = signal<string[]>([]);

    ingredientesIndexed = computed(() =>
        this.ingredientes().map((valor, idx) => ({ idx, valor }))
    );

    errorMessage = signal('');

    constructor(
        private srv: MedicamentoService,
        private auth: AuthStorageService,
        private router: Router
    ) { }

    addIngrediente() {
        this.ingredientes.set([...this.ingredientes(), '']);
    }

    removeIngrediente(i: number) {
        const list = this.ingredientes().slice();
        list.splice(i, 1);
        this.ingredientes.set(list);
    }

    updateIngrediente(i: number, value: string) {
        const list = this.ingredientes().slice();
        list[i] = value;
        this.ingredientes.set(list);
    }

    submit(): void {
        // validaciones básicas
        if (!this.nombre() || !this.ubicacion()  || !this.tipo()) {
            this.errorMessage.set('Rellena todos los campos obligatorios.');
            return;
        }

        // Creamos el objeto completo
        const nuevo = {
            nombre: this.nombre(),
            ubicacion: this.ubicacion(),
            cantidad: 0,
            tipo: this.tipo(),
            descripcion: this.descripcion(),
            ingredientes: this.ingredientes(),
            pedidos: [],  // inicial vacío
            ventas: []   // inicial vacío
        };

        // Llamada al servicio
        this.srv.addMedicamento(nuevo as any)
            .then(res => {
                // Añadimos al storage local
                const lista = [...this.auth.medicamentos(), res.data];
                this.auth.setMedicamentos(lista);
                // Volvemos al listado
                this.router.navigate(['/medicamentos']);
            })
            .catch(err => {
                console.error(err);
                this.errorMessage.set('Error al crear el medicamento.');
            });
    }
}
