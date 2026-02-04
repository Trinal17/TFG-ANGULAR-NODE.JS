// src/app/guards/auth.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthStorageService } from '../services/storage.service';

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const auth = inject(AuthStorageService);
  const router = inject(Router);

  // 1) ¿Estás logueado?
  if (!auth.isUserLoggedIn()) {
    router.navigate(['/']);
    return false;
  }

  // 2) ¿Se ha definido roles en la ruta?
  const roles = route.data['roles'] as string[] | undefined;
  if (roles && !roles.includes(auth.getUser()?.['rol']!)) {
    // No tienes el rol permitido
    router.navigate(['/principal']);
    return false;
  }

  // OK: logueado y cumple, o no había restricción de rol
  return true;
};
