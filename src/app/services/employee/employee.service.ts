import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
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

  getByUsername(username: string): Observable<any> {
    return this.http.get(`${BASE_URL}/getByUsername/${username}`);
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

  changePassword(id: number, data: any) {
    return this.http.post<{ message: string }>(`/api/changePassword/${id}`, data);
  }

  findEmployeesInProject(projectId: number): Observable<any> {
    return this.http.get(`${BASE_URL}/getByProject/${projectId}`);
  }

  findEmployeesNotInProject(projectId: number): Observable<any> {
    return this.http.get(`${BASE_URL}/getNotInProject/${projectId}`);
  }
}
