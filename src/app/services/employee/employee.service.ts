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
  ) { }

  searchWithFilter(filter: any): Observable<any> {
    return this.http.get(BASE_URL + "/search", {
      params: filter
    });
  }

  getAll(): Observable<any> {
    return this.http.get(BASE_URL);
  }

  getById(id: number): Observable<any> {
    return this.http.get(`${BASE_URL}/getById/${id}`);
  }

  create(request: any): Observable<any> {
    return this.http.post(BASE_URL + "/create", request);
  }

  update(id: number, request: any): Observable<any> {
    return this.http.put(`${BASE_URL}/update/${id}`, request);
  }

  changeStatus(id: number): Observable<any> {
    return this.http.put(`${BASE_URL}/changeStatus/${id}`, null);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${BASE_URL}/delete/${id}`);
  }

  changePassword(id: number, request: any): Observable<any> {
    return this.http.put(`${BASE_URL}/changePassword/${id}`, request);
  }

  getCurrentEmployee(): Observable<any> {
    return this.http.get(`${BASE_URL}/myInfo`)
  }
}
