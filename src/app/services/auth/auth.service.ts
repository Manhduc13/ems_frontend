import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { StorageService } from '../storage/storage.service';
import { jwtDecode } from "jwt-decode";
import { ToastService } from '../toast/toast.service';

const BASE_URL = "http://localhost:8080/api/auth";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient,
    private storageService: StorageService,
  ) { }

  login(loginRequest: any): Observable<any> {
    return this.http.post(BASE_URL + "/login", loginRequest);
  }

  validateToken(): boolean {
    const token = this.storageService.getToken();
    
    if (!token) {
      return false;
    }

    try {
      const decoded: any = jwtDecode(token);
      
      const currentTime = Date.now() / 1000; 
      const expirationDate = decoded.exp;

      return expirationDate > currentTime;
    } catch (error) {
      console.log("Failed to decode token:", error);
      return false;
    }
  }

  private isLoggedInSubject = new BehaviorSubject<boolean>(this.storageService.getToken() !== null);

  getIsLoggedIn(): Observable<boolean> {
    return this.isLoggedInSubject.asObservable();
  }

  setIsLoggedIn(isLoggedIn: boolean) {
    this.isLoggedInSubject.next(isLoggedIn);
  }
}