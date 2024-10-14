import { Component, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { SearchBoxComponent } from '../custom/search-box/search-box.component';
import {MatGridListModule} from '@angular/material/grid-list';
import { CommonModule } from '@angular/common';
import {MatCardModule} from '@angular/material/card';
import {MatMenuModule} from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { AddProjectComponent } from '../custom/project/add-project/add-project.component';
import { ProjectService } from '../shared/project/project.service';
import {
  MatSnackBar,
  MatSnackBarAction,
  MatSnackBarActions,
  MatSnackBarLabel,
  MatSnackBarRef,
} from '@angular/material/snack-bar';
import { SuccessAddEmployeeSnackbarComponent } from '../custom/employee/success-add-employee-snackbar/success-add-employee-snackbar.component';
import { Project } from '../shared/project/project.model';
import { RouterLink } from '@angular/router';
import { DeleteProjectComponent } from '../custom/project/delete-project/delete-project.component';

@Component({
  selector: 'app-project',
  standalone: true,
  imports: [
    MatButtonModule, 
    SearchBoxComponent,
    MatGridListModule,
    CommonModule,
    MatCardModule,
    MatMenuModule,
    MatIconModule,
    RouterLink
  ],
  templateUrl: './project.component.html',
  styleUrl: './project.component.css'
})
export class ProjectComponent implements OnInit{
  readonly dialog = inject(MatDialog);
  durationInSeconds = 5;
  constructor(private projectService: ProjectService, private _snackBar: MatSnackBar){}
  projectList = signal<Project[]>([])
  imageListLoad : {[key: number]: string[]} = {}
  employeeMore : {[key: number]: number} = {}

  ngOnInit(): void {
    this.LoadAllProject();
  }

  LoadAllProject(){
    this.projectService.getProjects().subscribe((projects : Project[])=>{
      let projectListTemp = [] 
      projectListTemp = projects.map((project) => ({
        ...project,
        listTech: project.listTech.map((item: string) => this.cleanTechList(item)) 
      }));
      this.projectList.set(projectListTemp)
      this.projectList().forEach(element => {
        let imgPaths: string[] = []
        element.tblEmployeeTblProjects.forEach(emp => {
          imgPaths.push(emp.tblEmployee.image)
        })
        this.AddToImgaeMap(this.imageListLoad, element.id, imgPaths)
      });
      for (const key in this.imageListLoad) {
        if (this.imageListLoad.hasOwnProperty(key)) {
          const projectId = Number(key);
          const imageArray = this.imageListLoad[projectId];
          this.AddToEmpMoreMap(this.employeeMore, projectId, imageArray.length)       
        }
      }
    })
  }

  AddToImgaeMap(dict: { [key: number]: string[] }, key: number, value: string[]) {
    dict[key] = value;
  }

  AddToEmpMoreMap(dict: { [key: number]: number }, key: number, value: number) {
    dict[key] = value;
  }

  cleanTechList(item: string): string {
    return item.replace(/[\[\]"]/g, '');
  }

  onRecieveSearchStr(searchTerm: string): void { 
    this.projectService.getProjectByQuery(searchTerm).subscribe({
      next: (projects: Project[]) => {
        let projectListTemp = [] 
        projectListTemp = projects.map((project) => ({
          ...project,
          listTech: project.listTech.map((item: string) => this.cleanTechList(item)) 
        }));
        this.projectList.set(projectListTemp);
      },
      error: (error) => {
        this.projectList.set([]);
      }
    });
  }

  openAddNewProjectDialog(){
    const dialogRef = this.dialog.open(AddProjectComponent, {
      minWidth: '1200px',
      panelClass: 'custom-dialog'
    });
    dialogRef.afterClosed().subscribe(newProject => {
      this.projectService.saveProject(newProject).subscribe(()=>{     
        this.LoadAllProject()
        this.openSnackBar()
      })
    });
  }

  openSnackBar() {
    this._snackBar.openFromComponent(SuccessAddEmployeeSnackbarComponent, {
      duration: this.durationInSeconds * 1000,
    });
  }

  onDeleteProject(projectId: number){
    this.openDeleteProjectDialog(projectId)
  }

  openDeleteSnackBar() {
    this._snackBar.open("Delete project successfully", "Done");
  }

  openDeleteProjectDialog(projectId: number){
    const dialogRef = this.dialog.open(DeleteProjectComponent, {
    });
    dialogRef.afterClosed().subscribe(newProject => {
      this.projectService.deleteProject(projectId).subscribe(()=>{
        this.LoadAllProject()
        this.openDeleteSnackBar()
      })
    });
  }
}