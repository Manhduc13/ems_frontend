import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StorageService } from '../storage/storage.service';
import { Observable } from 'rxjs';

const BASE_URL = "http://localhost:8080/api/projects";

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  constructor(
    private http: HttpClient,
    private storageService: StorageService
  ) { }

  getById(id: number): Observable<any> {
    return this.http.get(`${BASE_URL}/getById/${id}`, {
      headers: this.createAuthorizationHeader()
    });
  }

  getAll(): Observable<any> {
    return this.http.get(BASE_URL, {
      headers: this.createAuthorizationHeader()
    });
  }

  searchWithFilter(filter: any): Observable<any> {
    return this.http.get(BASE_URL + "/search", {
      params: filter,
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

  delete(id: number): Observable<any> {
    return this.http.delete(`${BASE_URL}/delete/${id}`, {
      headers: this.createAuthorizationHeader()
    });
  }

  updateStatus(id: number, status: any): Observable<any> {
    return this.http.put(`${BASE_URL}/updateStatus/${id}/${status}`, null, {
      headers: this.createAuthorizationHeader()
    });
  }

  addMember(projectId: number, employeeId: number): Observable<any> {
    return this.http.put(`${BASE_URL}/addMember/${projectId}/${employeeId}`, null, {
      headers: this.createAuthorizationHeader()
    });
  }

  removeMember(projectId: number, employeeId: number): Observable<any> {
    return this.http.put(`${BASE_URL}/removeMember/${projectId}/${employeeId}`, null, {
      headers: this.createAuthorizationHeader()
    });
  }

  setAsLeader(projectId: number, employeeId: number): Observable<any> {
    return this.http.put(`${BASE_URL}/chooseLeader/${projectId}/${employeeId}`, null, {
      headers: this.createAuthorizationHeader()
    });
  }

  getMembers(id: number): Observable<any> {
    return this.http.get(`${BASE_URL}/getMembers/${id}`, {
      headers: this.createAuthorizationHeader()
    });
  }

  getNotMembers(id: number): Observable<any> {
    return this.http.get(`${BASE_URL}/getNotMembers/${id}`, {
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
