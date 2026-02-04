import { Component, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AuthStorageService } from '../services/storage.service';

@Component({
    selector: 'app-perfil',
    standalone: true,
    templateUrl: './perfil.component.html',
    imports: [RouterLink],
})
export class PerfilComponent {
    nombre = signal('');
    apellidos = signal('');
    correo = signal('');
    password = signal('');
    rol = signal('');
    error = signal('');
    success = signal('');

    private userId!: string;

    constructor(
        private authSvc: AuthService,
        private authStorage: AuthStorageService,
        private router: Router
    ) {
        const user = this.authStorage.getUser();
        if (!user) {
            this.router.navigate(['/login']);
            return;
        }
        // Accedo con corchetes para evitar error TS
        this.userId = user['_id'];
        this.nombre.set(user['nombre']);
        this.apellidos.set(user['apellidos']);
        this.correo.set(user['correo']);
        this.rol.set(user['rol']);
    }

    save(): void {
        // Llamada al servicio, sin async/await
        this.authSvc
            .updateProfile(
                this.userId,
                this.nombre(),
                this.apellidos(),
                this.password()
            )
            .then(res => {
                // Actualiza sólo los datos devueltos
                this.authStorage.setUser(res.data);
                this.success.set('Perfil actualizado con éxito');
                this.error.set('');
            })
            .catch(err => {
                this.error.set(
                    err.response?.data?.message
                    || 'Error al actualizar perfil'
                );
                this.success.set('');
            });
    }
}
