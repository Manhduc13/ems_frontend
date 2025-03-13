import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StorageService } from '../storage/storage.service';

const BASE_URL = "http://localhost:8080/api/employees";

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  constructor(
    private http: HttpClient,
    private storageService: StorageService
  ) { }

  getAll(){
    return this.http.get(BASE_URL);
  }

  getById(id: number){
    return this.http.get(`${BASE_URL}/${id}`);
  }

  create(request: any){
    return this.http.post(BASE_URL + "/create", request);
  }

  update(id: number, request: any){
    return this.http.put(BASE_URL + "/update/" + id, request);
  }

  banned(id: number){
    return this.http.put(`${BASE_URL}/banned/${id}`, null);
  }

  delete(id: number){
    return this.http.delete(`${BASE_URL}/delete/${id}`);
  }

  createAuthorizationHeader(): HttpHeaders {
    let authHeaders: HttpHeaders = new HttpHeaders();
    return authHeaders.set(
      'Authorization',
      'Bearer ' + this.storageService.getToken()
    );
  }
}
