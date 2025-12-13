import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  // Skip adding token for auth endpoints
  if (req.url.includes('/auth/login') || req.url.includes('/auth/signup')) {
    return next(req);
  }

  // Get token from auth service
  const token = authService.getToken();
  const loginMethod = authService.getLoginMethod();

  // Clone the request and add the authorization header
  if (token) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
        ...(loginMethod && { 'X-Login-Method': loginMethod })
      }
    });
    return next(authReq);
  }

  return next(req);
};

