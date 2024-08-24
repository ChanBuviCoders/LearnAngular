import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, take } from 'rxjs/operators';
import { SubjectService } from './subjectService';

export const AuthGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const userService = inject(SubjectService);

  return userService.isAuthenticated.pipe(
    take(1),
    map(isAuthenticated => {
      if (isAuthenticated) {
        return true;
      } else {
        // router.navigate(['/login']); // Redirect to login page if not authenticated
        return false;
      }
    })
  );
};