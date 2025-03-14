import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StorageService } from '../storage/storage.service';

const BASE_URL = "http://localhost:8080/api/roles";

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  constructor(
      private http: HttpClient,
      private storageService: StorageService
    ) { }

  getAll(){
    return this.http.get(BASE_URL, {
      headers: this.createAuthorizationHeader()
    });
  }

  getById(id: number){
    return this.http.get(`${BASE_URL}/${id}`, {
      headers: this.createAuthorizationHeader()
    });
  }

  createAuthorizationHeader(): HttpHeaders {
      let authHeaders: HttpHeaders = new HttpHeaders();
      return authHeaders.set(
        'Authorization',
        'Bearer ' + this.storageService.getToken()
      );
    }
}
