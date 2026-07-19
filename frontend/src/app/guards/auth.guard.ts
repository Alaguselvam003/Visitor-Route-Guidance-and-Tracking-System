import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('jwt_token');
  const role = localStorage.getItem('user_role');

  if (!token) {
    router.navigate(['/login']);
    return false;
  }

  const expectedRoles = route.data ? (route.data['roles'] as Array<string>) : [];

  if (expectedRoles && expectedRoles.length > 0) {
    const userRole = role ? role.toUpperCase() : '';
    if (!expectedRoles.map(r => r.toUpperCase()).includes(userRole)) {

      router.navigate(['/login']);
      return false;
    }
  }

  return true;
};
