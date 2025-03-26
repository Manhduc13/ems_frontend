import { inject } from '@angular/core';
import { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { Observable, switchMap, catchError, EMPTY } from 'rxjs';
import { Router } from '@angular/router';
import { StorageService } from '../storage/storage.service';
import { AuthService } from './auth.service';
import { ToastService } from '../toast/toast.service';

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {
  const storageService = inject(StorageService);
  const authService = inject(AuthService);
  const toastService = inject(ToastService);
  const router = inject(Router);

  const token = storageService.getToken();

  const excludedUrls = [
    'http://localhost:8080/api/auth'
  ];

  if (excludedUrls.some(url => req.url.startsWith(url))) {
    console.log("Api bỏ qua Interceptor:", req.url);
    return next(req);
  }

  const tokenExpired = authService.validateToken();

  if (!tokenExpired) {
    toastService.showToast("Token expired. Please login again", "warning");
    localStorage.clear();
    router.navigate(['/login']);
    return EMPTY;
  }

  // Nếu token hợp lệ, gắn vào header
  const clonedReq = req.clone({
    setHeaders: { Authorization: `Bearer ${token}` }
  });

  return next(clonedReq);
};
