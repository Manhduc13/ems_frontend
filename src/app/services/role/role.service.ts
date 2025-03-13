import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

const BASE_URL = "http://localhost:8080/api/roles";

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  constructor(private http: HttpClient) { }

  getAll(){
    return this.http.get(BASE_URL);
  }

  getById(id: number){
    return this.http.get(`${BASE_URL}/${id}`);
  }
}
