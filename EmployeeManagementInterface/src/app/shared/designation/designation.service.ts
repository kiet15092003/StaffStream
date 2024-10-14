import { Injectable } from '@angular/core';
import { Designation } from './designation.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DesignationService {
  constructor(public myHttp:HttpClient) { }
  designationUrl:string = 'https://localhost:7220/api/Designation';
  private getHttpOptions() {
    const token = localStorage.getItem('authToken');

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return { headers };

  }
  getDesignations():Observable<Designation[]>{
    return this.myHttp.get<Designation[]>(this.designationUrl, this.getHttpOptions())
  }
}