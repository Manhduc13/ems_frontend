import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() {
  }

  saveToken(token: string) {
    //this.removeToken();
    window.localStorage.setItem("token", token);
  }

  saveUserInfo(user: any) {
    //this.removeUserInfo();
    window.localStorage.setItem("userInfo", JSON.stringify(user));
  }

  removeToken() {
    window.localStorage.removeItem("token");
  }

  removeUserInfo() {
    window.localStorage.removeItem("userInfo");
  }

  getToken(): string | null {
    return window.localStorage.getItem("token");
  }
}
