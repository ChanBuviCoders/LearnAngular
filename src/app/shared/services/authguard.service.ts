import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, take } from 'rxjs/operators';
import { SubjectService } from './subjectService';

export const AuthGuard: CanActivateFn = () => {
  const router = inject(Router);
  const subjectService = inject(SubjectService);

  return subjectService.isAuthenticated.pipe(
    take(1),
    map(isAuthenticated => {
      if (isAuthenticated) {
        return true;
      }
      router.navigate(['/login']);
      return false;
    })
  );
};
