import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StorageService } from '../storage/storage.service';
import { Observable } from 'rxjs';

const BASE_URL = "http://localhost:8080/api/report";

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  constructor(
    private http: HttpClient,
  ) { }

  generateEmployeeReport(): Observable<Blob> {
    return this.http.get(`${BASE_URL}/employee`, {
      responseType: 'blob',
    });
  }

  generateProjectReport(): Observable<any> {
    return this.http.get(`${BASE_URL}/project`, {
      responseType: 'blob',
    })
  }
}
