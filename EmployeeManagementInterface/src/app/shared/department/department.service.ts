import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Department } from './department.model';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {
  constructor(public myHttp:HttpClient) { }
  DepartmentUrl:string = 'https://localhost:7220/api/Department';

  private getHttpOptions() {
    const token = localStorage.getItem('authToken');

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return { headers };

  }
  getDepartments():Observable<Department[]>{
    return this.myHttp.get<Department[]>(this.DepartmentUrl, this.getHttpOptions())
  }
}
