import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StorageService } from '../storage/storage.service';
import { Observable } from 'rxjs';

const BASE_URL = "http://localhost:8080/api/employees";

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  constructor(
    private http: HttpClient,
    private storageService: StorageService
  ) { }

  searchWithFilter(filter: any): Observable<any> {
    return this.http.get(BASE_URL + "/search", {
      params: filter,
      headers: this.createAuthorizationHeader()
    });
  }

  getAll(): Observable<any> {
    return this.http.get(BASE_URL, {
      headers: this.createAuthorizationHeader()
    });
  }

  getById(id: number): Observable<any> {
    return this.http.get(`${BASE_URL}/getById/${id}`, {
      headers: this.createAuthorizationHeader()
    });
  }

  create(request: any): Observable<any> {
    return this.http.post(BASE_URL + "/create", request, {
      headers: this.createAuthorizationHeader()
    });
  }

  update(id: number, request: any): Observable<any> {
    return this.http.put(`${BASE_URL}/update/${id}`, request, {
      headers: this.createAuthorizationHeader()
    });
  }

  changeStatus(id: number): Observable<any> {
    return this.http.put(`${BASE_URL}/changeStatus/${id}`, null, {
      headers: this.createAuthorizationHeader()
    });
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${BASE_URL}/delete/${id}`, {
      headers: this.createAuthorizationHeader()
    });
  }

  changePassword(id: number, request: any): Observable<any> {
    return this.http.put(`${BASE_URL}/changePassword/${id}`, request, {
      headers: this.createAuthorizationHeader()
    });
  }

  getCurrentEmployee(): Observable<any> {
    return this.http.get(`${BASE_URL}/myInfo`, {
      headers: this.createAuthorizationHeader()
    })
  }

  createAuthorizationHeader(): HttpHeaders {
    let authHeaders: HttpHeaders = new HttpHeaders();
    return authHeaders.set(
      'Authorization',
      'Bearer ' + this.storageService.getToken()
    );
  }
}
