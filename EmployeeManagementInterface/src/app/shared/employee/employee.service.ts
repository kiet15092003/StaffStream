import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AddNewEmployeeDTO, Employee } from './employee.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private employeeUrl: string = '/api/Employee';

  constructor(public myHttp: HttpClient) { }

  private getHttpOptions() {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return { headers };
  }

  saveEmployee(emp: AddNewEmployeeDTO): Observable<AddNewEmployeeDTO> {
    const formData = new FormData();
    formData.append('firstName', emp.firstName);
    formData.append('lastName', emp.lastName);
    formData.append('email', emp.email);
    formData.append('salary', emp.salary.toString());
    formData.append('hireDate', emp.hireDate);
    formData.append('gender', emp.gender);
    formData.append('isMarried', emp.isMarried.toString());
    formData.append('designationId', emp.designationId.toString());
    formData.append('departmentId', emp.departmentId.toString());
    if (emp.image) {
      formData.append('image', emp.image, emp.image.name);
    }
    return this.myHttp.post<AddNewEmployeeDTO>(this.employeeUrl, formData, this.getHttpOptions());
  }

  updateEmployee(id: number, emp: AddNewEmployeeDTO): Observable<AddNewEmployeeDTO> {
    const formData = new FormData();
    formData.append('firstName', emp.firstName);
    formData.append('lastName', emp.lastName);
    formData.append('email', emp.email);
    formData.append('salary', emp.salary.toString());
    formData.append('hireDate', emp.hireDate);
    formData.append('gender', emp.gender);
    formData.append('isMarried', emp.isMarried.toString());
    formData.append('designationId', emp.designationId.toString());
    formData.append('departmentId', emp.departmentId.toString());
    if (emp.image) {
      formData.append('image', emp.image, emp.image.name);
    }
    return this.myHttp.put<AddNewEmployeeDTO>(`${this.employeeUrl}/${id}`, formData, this.getHttpOptions());
  }

  getEmployees(): Observable<Employee[]> {
    return this.myHttp.get<Employee[]>(this.employeeUrl, this.getHttpOptions());
  }

  getEmployeeById(id: number): Observable<Employee> {
    return this.myHttp.get<Employee>(`${this.employeeUrl}/${id}`, this.getHttpOptions());
  }

  deleteEmployee(id: number): Observable<any> {
    return this.myHttp.delete(`${this.employeeUrl}/${id}`, this.getHttpOptions());
  }

  getEmployeeImg(imgPath: string): Observable<File> {
    return this.myHttp.get<File>(`${this.employeeUrl}/image/${imgPath}`, this.getHttpOptions());
  }

  getEmployeeImgNext(imgPath: string): Observable<Blob> {
    return this.myHttp.get(`${this.employeeUrl}/image/${imgPath}`, { responseType: 'blob', ...this.getHttpOptions() });
  }

  searchEmployees(search: string): Observable<Employee[]> {
    let params = new HttpParams();
    if (search) {
      params = params.set('search', search);
    }
    return this.myHttp.get<Employee[]>(`${this.employeeUrl}/search`, { params, ...this.getHttpOptions() });
  }

  deleteMultiEmployee(ids: number[]): Observable<any> {
    return this.myHttp.post(`${this.employeeUrl}/deleteMultiEmp`, ids, this.getHttpOptions());
  }
}