import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const BASE_URL = "http://localhost:8080/api/report";

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  constructor(
    private http: HttpClient,
  ) { }

  generateEmployeeReport(username: string): Observable<Blob> {
    return this.http.get(`${BASE_URL}/employee/${username}`, {
      responseType: 'blob',
    });
  }

  generateProjectReport(username: string): Observable<any> {
    return this.http.get(`${BASE_URL}/project/${username}`, {
      responseType: 'blob',
    })
  }
}
