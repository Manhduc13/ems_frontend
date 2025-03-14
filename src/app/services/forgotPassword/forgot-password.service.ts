import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const BASE_URL = "http://localhost:8080/api/resetPassword";

@Injectable({
  providedIn: 'root'
})
export class ForgotPasswordService {

  constructor(private http: HttpClient) { }

  verifyEmail(request: any): Observable<any> {
    return this.http.post(BASE_URL + "/verify-email", request);
  }

  verifyToken(token: string): Observable<any> {
    return this.http.get(BASE_URL + "/verify-token/" + token);
  }

  changePassword(request: any): Observable<any> {
    return this.http.post(BASE_URL + "/change-password", request);
  }
}
