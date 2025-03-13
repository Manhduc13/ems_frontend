import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

const BASE_URL = "http://localhost:8080/api/auth";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) {}

  login(loginRequest: any): Observable<any> {
    return this.http.post(BASE_URL + "/login", loginRequest);
  }

  validateToken(token: string): Observable<any> {
    return this.http.post(BASE_URL + "/validate-token", token);
  }

  getIsLoggedIn(): Observable<boolean> {
    return this.isLoggedInSubject.asObservable();
  }

  setIsLoggedIn(isLoggedIn: boolean) {
    this.isLoggedInSubject.next(isLoggedIn);
  }
}