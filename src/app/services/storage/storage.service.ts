import {Injectable} from '@angular/core';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() {}

  saveToken(token: string) {
    this.removeToken();
    window.localStorage.setItem("token", token);
  }

  removeToken() {
    window.localStorage.removeItem("token");
  }

  getToken(): string | null {
    return window.localStorage.getItem("token");
  }

  decodeToken(): any {
    const token = this.getToken() ?? "";
    const decoded: any = jwtDecode(token);
    return decoded;
  }

  getUsernameFromToken(): string {
    const decodedToken = this.decodeToken();
    return decodedToken.sub;
  }

  getRoleFromToken(): string {
    const decodedToken = this.decodeToken();
    return decodedToken.roles;
  }
}
