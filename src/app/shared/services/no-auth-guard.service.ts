import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, take } from 'rxjs/operators';
import { SubjectService } from './subjectService';

export const NoAuthGuard: CanActivateFn = () => {
  const router = inject(Router);
  const subjectService = inject(SubjectService);

  return subjectService.isAuthenticated.pipe(
    take(1),
    map((isAuthenticated: boolean) => {
      if (!isAuthenticated) {
        return true;
      }
      router.navigate(['/dashboard']);
      return false;
    })
  );
};
