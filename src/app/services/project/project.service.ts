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
  ) { }

  searchWithFilter(filter: any): Observable<any> {
    return this.http.get(BASE_URL + "/search", {
      params: filter,
    });
  }

  getById(id: number): Observable<any> {
    return this.http.get(`${BASE_URL}/getById/${id}`);
  }

  getAll(): Observable<any> {
    return this.http.get(BASE_URL);
  }

  create(request: any): Observable<any> {
    return this.http.post(BASE_URL + "/create", request);
  }

  update(id: number, request: any): Observable<any> {
    return this.http.put(`${BASE_URL}/update/${id}`, request);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${BASE_URL}/delete/${id}`);
  }

  updateStatus(id: number, status: any): Observable<any> {
    return this.http.put(`${BASE_URL}/updateStatus/${id}/${status}`, null);
  }

  addMember(projectId: number, employeeId: number): Observable<any> {
    return this.http.put(`${BASE_URL}/addMember/${projectId}/${employeeId}`, null);
  }

  removeMember(projectId: number, employeeId: number): Observable<any> {
    return this.http.put(`${BASE_URL}/removeMember/${projectId}/${employeeId}`, null);
  }

  chooseLeader(projectId: number, employeeId: number): Observable<any> {
    return this.http.put(`${BASE_URL}/chooseLeader/${projectId}/${employeeId}`, null);
  }

  findProjectsOfEmployee(employeeId: number): Observable<any> {
    return this.http.get(`${BASE_URL}/getByEmployee/${employeeId}`);
  }
}
