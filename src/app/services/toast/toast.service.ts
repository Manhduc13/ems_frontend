import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor() { }

  toasts$ = new BehaviorSubject<{ message: string; type: string } | null>(null);

  showToast(message: string, type: 'success' | 'error' | 'warning' | 'info') {
    this.toasts$.next({ message, type });

    setTimeout(() => this.toasts$.next(null), 2000);
  }
}
