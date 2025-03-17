import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StorageService } from '../storage/storage.service';
import { Observable } from 'rxjs';

const BASE_URL = "http://localhost:8080/api/employees";
const cloudinaryUrl = 'http://localhost:8080/cloudinary/upload';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  constructor(
    private http: HttpClient,
    private storageService: StorageService
  ) { }

  searchWithFilter(keyword: any): Observable<any> {
    return this.http.get(BASE_URL + "/search", {
      params: keyword,
      headers: this.createAuthorizationHeader()
    });
  }

  getAll(): Observable<any> {
    return this.http.get(BASE_URL, {
      headers: this.createAuthorizationHeader()
    });
  }

  getById(id: number): Observable<any> {
    return this.http.get(`${BASE_URL}/${id}`, {
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

  uploadImage(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('image', file);
    return this.http.post(cloudinaryUrl, formData);
  }

  createAuthorizationHeader(): HttpHeaders {
    let authHeaders: HttpHeaders = new HttpHeaders();
    return authHeaders.set(
      'Authorization',
      'Bearer ' + this.storageService.getToken()
    );
  }
}
