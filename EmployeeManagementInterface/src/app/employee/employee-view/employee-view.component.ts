import { ChangeDetectionStrategy, Component, inject, OnInit, signal, Signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import { EmployeeService } from '../../shared/employee/employee.service';
import { Employee } from '../../shared/employee/employee.model';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { EditEmployeeComponent } from '../../custom/employee/edit-employee/edit-employee.component';
import { Project } from '../../shared/project/project.model';
import { CommonModule } from '@angular/common';
import { ConfirmOutProjectComponent } from '../../custom/employee/confirm-out-project/confirm-out-project.component';
import { ProjectService } from '../../shared/project/project.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DeleteOneDialogComponent } from '../../custom/employee/delete-one-dialog/delete-one-dialog.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-employee-view',
  standalone: true,
  imports: [MatCardModule,MatButtonModule,MatIconModule,DatePipe,CommonModule],
  templateUrl: './employee-view.component.html',
  styleUrl: './employee-view.component.css',
})
export class EmployeeViewComponent implements OnInit{
  constructor(
    private route: ActivatedRoute, 
    private empService: EmployeeService, 
    private projectService: ProjectService,
    private router: Router
  ) {}

  employeeId = signal<number | null>(null);
  empDisplay: Employee
  readonly dialog = inject(MatDialog);
  imageListLoad : {[key: number]: string[]} = {}
  employeeMore : {[key: number]: number} = {}
  listAllProject = signal<Project[]>([])
  private _snackBar = inject(MatSnackBar);

  loadEmp() {
    const id = this.employeeId();
    if (id !== null) {
      this.empService.getEmployeeById(id).subscribe((emp: Employee) => {
        this.empDisplay = emp;
        let listProject = []
        emp.tblEmployeeTblProjects.forEach(element => {
          element.tblProject.listTech = element.tblProject.listTech.
            map((item: string) => this.cleanTechList(item)) 
          listProject.push(element.tblProject)
          this.listAllProject.set(listProject)
        }); 
        this.listAllProject().forEach(element => {
          console.log(element)
          let imgPaths: string[] = [emp.image]
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
      });
    }
  }

  cleanTechList(item: string): string {
    return item.replace(/[\[\]"]/g, '');
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.employeeId.set(params.get('id') ? parseInt(params.get('id')!, 10) : null);   
      this.loadEmp();
    });
  }

  AddToEmpMoreMap(dict: { [key: number]: number }, key: number, value: number) {
    dict[key] = value;
  }

  AddToImgaeMap(dict: { [key: number]: string[] }, key: number, value: string[]) {
    dict[key] = value;
  }

  openEditDialog(): void {
    const dialogRef = this.dialog.open(EditEmployeeComponent, {
      data: {employee: this.empDisplay},
      minWidth: '800px'
    });

    dialogRef.afterClosed().subscribe((newEmp) => {
      if (newEmp) {
        const id = this.employeeId();
        if (id !== null) {
          this.empService.updateEmployee(id, newEmp).subscribe(() => {
            this.loadEmp();
          });
        }
      }
    });
  }

  onRemoveEmpFromProject(project:Project){
    const dialogRef = this.dialog.open(ConfirmOutProjectComponent, {});
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.projectService.deleteEmp(project.id, this.employeeId()!).subscribe(()=>{
          this.openOutProjectSuccessSnackBar();
          this.loadEmp()
        })
        }
    });
  }

  openOutProjectSuccessSnackBar(){
    this._snackBar.open("Out project successfully", "Done");
  }

  openDeleteSuccessSnackBar(){
    this._snackBar.open("Delete employee successfully", "Done");
  }

  onClickEditButton(){
    this.openEditDialog()
  }

  onClickDeleteButton(){
    const dialogRef = this.dialog.open(DeleteOneDialogComponent, {
      data: {employee: this.empDisplay}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.empService.deleteEmployee(this.employeeId()!).subscribe(()=>{
          this.router.navigate(['/employee']);
        })
      }
    });
  }
}