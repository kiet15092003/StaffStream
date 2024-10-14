import { AfterViewInit, Component, inject, OnInit, signal } from '@angular/core';
import { ProjectService } from '../../shared/project/project.service';
import { ActivatedRoute } from '@angular/router';
import { Project } from '../../shared/project/project.model';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import {FormBuilder, Validators, FormsModule, ReactiveFormsModule, FormGroup} from '@angular/forms';
import { Employee } from '../../shared/employee/employee.model';
import {MatInputModule} from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { SearchBoxComponent } from '../../custom/search-box/search-box.component';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmEditEmpInProjectComponent } from '../../custom/project/confirm-edit-emp-in-project/confirm-edit-emp-in-project.component';
import { AddEmpToProjectDTO } from '../../shared/project-employee/project-employee.model';

export interface EmpElement{
  emp: Employee;
  role: string;
  assignmentDate: string;
  editMode: boolean;
}

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [
    MatCardModule,
    MatMenuModule,
    MatButtonModule,
    MatIconModule,
    CommonModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    SearchBoxComponent,
    MatSnackBarModule
  ],
  templateUrl: './project-detail.component.html',
  styleUrl: './project-detail.component.css',
  providers: [provideNativeDateAdapter()],
})
export class ProjectDetailComponent implements OnInit{
  constructor(private projectService: ProjectService, private route: ActivatedRoute){}
  projectId = signal<number | null>(null);
  projectDisplay = signal<Project>(new Project())
  private _formBuilder = inject(FormBuilder);
  dataSource = new MatTableDataSource<EmpElement>();

  empListFormGroup = this._formBuilder.group({});
  displayedColumns: string[] = ['name', 'role', 'assignmentDate','task'];

  isButtonAcceptDisabled = signal<boolean>(false)

  private _snackBar = inject(MatSnackBar);
  readonly dialog = inject(MatDialog);

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.projectId.set(params.get('id') ? parseInt(params.get('id')!, 10) : null);   
      if (this.projectId()) {
        this.getProject();
      }
    });
  }

  getProject(){
    this.projectService.getProjectById(this.projectId()!).subscribe((project) => {
      project.listTech = project.listTech.map((item: string) => this.cleanTechList(item)); 
      this.projectDisplay.set(project);  
      this.getDataSource("");   
    });
  }
  
  getDataSource(query: string) {
    const dataSourceArray: EmpElement[] = [];
    this.projectDisplay().tblEmployeeTblProjects.forEach((empInProject, index) => {
      const newElement: EmpElement = {
        emp: empInProject.tblEmployee,
        role: empInProject.role,
        assignmentDate: empInProject.assignmentDate,
        editMode: false
      };
      if (newElement.emp.firstName.toLowerCase().includes(query.trim().toLowerCase())
        || newElement.emp.lastName.toLowerCase().includes(query.trim().toLowerCase())
        || newElement.role.toLowerCase().includes(query.trim().toLowerCase()))
      {
        dataSourceArray.push(newElement);
        this.empListFormGroup.addControl(
          'id_' + index, 
          this._formBuilder.control(newElement.emp.id, [Validators.required, Validators.pattern('^[a-zA-Z ]+$')])
        );   
        this.empListFormGroup.addControl(
          'role_' + index, 
          this._formBuilder.control(newElement.role, [Validators.required, Validators.pattern('^[a-zA-Z ]+$')])
        );   
        this.empListFormGroup.addControl(
          'assignmentDate_' + index, 
          this._formBuilder.control(newElement.assignmentDate)
        );
      }   
    });
    this.dataSource.data = dataSourceArray;
  }
  
  cleanTechList(item: string): string {
    return item.replace(/[\[\]"]/g, '');
  }

  toggleEditMode(element: EmpElement) {
    element.editMode = !element.editMode;
    let countEditMode = 0;
    this.dataSource.data.forEach((empElement)=>{
      if (empElement.editMode){countEditMode++}
    })
    if (countEditMode===0){
      this.isButtonAcceptDisabled.set(false)
    } else {
      this.isButtonAcceptDisabled.set(true)
    }
  }

  onRecieveSearchStr(searchTerm: string): void {
    this.getDataSource(searchTerm)
  }

  onAcceptChange(){
    const updatedData = this.dataSource.data.map((element, index) => ({
      id: this.empListFormGroup.get('id_' + index)?.value,
      role: this.empListFormGroup.get('role_' + index)?.value,
      assignmentDate: this.empListFormGroup.get('assignmentDate_' + index)?.value,
    }));
    let haveChange = false;
    this.dataSource.data.map((element, index)=>{
      if (updatedData[index].id === element.emp.id 
        && (updatedData[index].role !== element.role
        || updatedData[index].assignmentDate !== element.assignmentDate)
      ){
        haveChange = true
      }
    })
    if (haveChange){
      const dialogRef = this.dialog.open(ConfirmEditEmpInProjectComponent, {});
      let newEmps : AddEmpToProjectDTO[] = []
      updatedData.forEach(element => {
        let newEmp = new AddEmpToProjectDTO()
        newEmp.empId = element.id
        newEmp.role = element.role
        newEmp.assignmentDate = element.assignmentDate
        newEmps.push(newEmp)
      });
      console.log(newEmps)
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.projectService.updateEmps(this.projectId()!, newEmps).subscribe(()=>{
            this.openChangeSuccessSnackBar()
            this.getProject()
            this.getDataSource("")
          })
        }
      });
    } else {
      this.openNotChangeSnackBar();
    }
  }

  onDeleteEmp(emp: EmpElement){
    const dialogRef = this.dialog.open(ConfirmEditEmpInProjectComponent, {});
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.projectService.deleteEmp(this.projectId()!, emp.emp.id).subscribe(()=>{
          this.openDeleteSuccessSnackBar();
          this.getProject()
          this.getDataSource("")
        })
        }
    });
  }

  openNotChangeSnackBar() {
    this._snackBar.open("Not have any changes", "Done");
  }

  openChangeSuccessSnackBar() {
    this._snackBar.open("Update employees successfully", "Done");
  }

  openDeleteSuccessSnackBar() {
    this._snackBar.open("Delete employee successfully", "Done");
  }
}