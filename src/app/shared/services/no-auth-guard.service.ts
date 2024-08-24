import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, take } from 'rxjs/operators';
import { SubjectService } from './subjectService';


export const NoAuthGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const userService = inject(SubjectService);

  return userService.isAuthenticated.pipe(
    take(1),
    map((isAuthenticated: boolean) => {
      if (!isAuthenticated) {
        return true; // Allow activation if the user is not authenticated
      } else {
        return false; // Prevent activation
      }
    })
  );
};
