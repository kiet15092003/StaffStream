import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AddNewProjectDTO, Project } from './project.model';
import { catchError, Observable, throwError } from 'rxjs';
import { AddEmpToProjectDTO } from '../project-employee/project-employee.model';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  constructor(public myHttp:HttpClient) { }
  projectUrl: string = '/api/Project';

  private getHttpOptions() {
    const token = localStorage.getItem('authToken');

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return { headers };

  }

  saveProject (project:AddNewProjectDTO) : Observable<AddNewProjectDTO> {
    const formData = new FormData();
    formData.append('ProjectName',project.projectName);
    formData.append('StartDate',project.startDate);
    formData.append('EndDate',project.endDate);
    formData.append('Description',project.description);
    formData.append('ListTech',JSON.stringify(project.listTech));
    if (project.image) {
      formData.append('image', project.image, project.image.name);
    }
    return this.myHttp.post<AddNewProjectDTO>(this.projectUrl, formData, this.getHttpOptions());
  }

  getProjects() : Observable<Project[]> {
    return this.myHttp.get<Project[]>(`${this.projectUrl}`, this.getHttpOptions())
  }

  getProjectById(id: number) : Observable<Project> {
    return this.myHttp.get<Project>(`${this.projectUrl}/${id}`, this.getHttpOptions())
  }

  getProjectTechType() : Observable<string[]> {
    return this.myHttp.get<string[]>(`${this.projectUrl}/TechType`, this.getHttpOptions())
  }

  getProjectImg(imgPath: string): Observable<Blob> {
    return this.myHttp.get<Blob>(`${this.projectUrl}/image/${imgPath}`, {responseType: 'blob' as 'json', ...this.getHttpOptions()});
  }
  
  addEmpsToProject(emps: AddEmpToProjectDTO[], projectId: number): Observable<void> {
    return this.myHttp.post<void>(`${this.projectUrl}/AddEmpsToProject/${projectId}`, emps, this.getHttpOptions());
  }

  getProjectByQuery(query: string): Observable<Project[]> {
    const params = new HttpParams().set('search', query);
    const options = this.getHttpOptions(); 
    return this.myHttp.get<Project[]>(`${this.projectUrl}/search`, { ...options, params });
  }

  updateEmps(id: number, newEmps: AddEmpToProjectDTO[]): Observable<any>{
    return this.myHttp.put(`${this.projectUrl}/UpdateEmps/${id}`, newEmps, this.getHttpOptions());
  }

  deleteEmp(id: number, empId: number) : Observable<any> {
    const params = new HttpParams().set('empId', empId);
    const options = this.getHttpOptions(); 
    return this.myHttp.delete(`${this.projectUrl}/DeleteEmp/${id}`, { ...options, params });
  }

  deleteProject(id: number) : Observable<any>{
    return this.myHttp.delete(`${this.projectUrl}/${id}`, this.getHttpOptions());
  }
}