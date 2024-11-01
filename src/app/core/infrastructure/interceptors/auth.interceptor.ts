import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../../application/use-cases/auth.service';
import { Router } from '@angular/router';

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const token = authService.getJwtToken();
  
  if (token) {
    req = addToken(req, token);
  }


  return next(req).pipe(
    catchError((error) => {
      if (error instanceof HttpErrorResponse && error.status === 401) {
        return handle401Error(authService, router);
      } else {
        return throwError(() => error);
      }
    })
  );
};

function addToken(request: HttpRequest<unknown>, token: string): HttpRequest<unknown> {
  return request.clone({
    setHeaders: {
      'Authorization': `Bearer ${token}`
    }
  });
}

function handle401Error(authService: AuthService, router: Router) {
  authService.logout().subscribe(() => {
    router.navigate(['/login']);
  });
  return throwError(() => new Error('Sesión expirada. Por favor, inicie sesión de nuevo.'));
}