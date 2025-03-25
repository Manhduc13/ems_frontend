import { HttpClient } from '@angular/common/http';
import {Injectable} from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() {}

  saveToken(token: string) {
    this.removeToken();
    window.localStorage.setItem("token", token);
  }

  saveUserInfo(user: any) {
    this.removeUserInfo();
    window.localStorage.setItem("userInfo", JSON.stringify(user));
  }

  removeToken() {
    window.localStorage.removeItem("token");
  }

  removeUserInfo() {
    window.localStorage.removeItem("userInfo");
  }

  clear() {
    this.removeToken();
    this.removeUserInfo();
  }

  getToken(): string | null {
    return window.localStorage.getItem("token");
  }

  getUserInfo(): any {
    const userInfoString = window.localStorage.getItem("userInfo");
    return userInfoString ? JSON.parse(userInfoString) : null;
  }
}
