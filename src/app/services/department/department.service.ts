import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const BASE_URL = "http://localhost:8080/api/departments";

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {

  constructor(
    private http: HttpClient,
  ) { }

  getAll(): Observable<any> {
    return this.http.get(BASE_URL);
  }

  getById(id: number): Observable<any> {
    return this.http.get(`${BASE_URL}/getById/${id}`);
  }

  getByName(name: string): Observable<any> {
    return this.http.get(`${BASE_URL}/getByName/${name}`);
  }
}
