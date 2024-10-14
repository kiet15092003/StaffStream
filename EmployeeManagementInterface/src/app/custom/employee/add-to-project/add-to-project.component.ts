import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { Employee } from '../../../shared/employee/employee.model';
import { CommonModule } from '@angular/common';
import { provideNativeDateAdapter } from '@angular/material/core';
import {FormBuilder, Validators, FormsModule, ReactiveFormsModule, FormGroup} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatStepperModule} from '@angular/material/stepper';
import {MatButtonModule} from '@angular/material/button';
import { ProjectService } from '../../../shared/project/project.service';
import { Project } from '../../../shared/project/project.model';
import {MatListModule} from '@angular/material/list';
import {MatCardModule} from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { SearchBoxComponent } from '../../search-box/search-box.component';
import { AddEmpToProjectDTO } from '../../../shared/project-employee/project-employee.model';
import { MatSnackBar } from '@angular/material/snack-bar';

export interface EmpElement {
  emp: Employee;
  role: string;
  assignmentDate: string;
}

@Component({
  selector: 'app-add-to-project',
  standalone: true,
  imports: [
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogTitle,
    CommonModule,
    MatFormFieldModule,
    MatButtonModule,
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatListModule,
    MatCardModule,
    MatIconModule,
    MatChipsModule,
    MatTableModule, 
    MatPaginatorModule,
    MatDatepickerModule,
    SearchBoxComponent
  ],
  templateUrl: './add-to-project.component.html',
  styleUrl: './add-to-project.component.css',
  providers: [provideNativeDateAdapter()],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class AddToProjectComponent implements OnInit{
  constructor(private projectService: ProjectService){}

  listAllProject : Project[] = []
  readonly dialogRef = inject(MatDialogRef<AddToProjectComponent>);
  readonly data = inject<Employee[]>(MAT_DIALOG_DATA);
  private _formBuilder = inject(FormBuilder);
  projectChoosed : Project = new Project()
  displayedColumns: string[] = ['name', 'role', 'assignmentDate'];
  dataSource = new MatTableDataSource<EmpElement>();
  firstFormGroup = this._formBuilder.group({
  });
  secondFormGroup = this._formBuilder.group({
  });
  empsToAddFinal : AddEmpToProjectDTO[] = []
  private _snackBar = inject(MatSnackBar);

  imageListLoad : {[key: number]: string[]} = {}
  employeeMore : {[key: number]: number} = {}

  ngOnInit(): void {
    this.projectService.getProjects().subscribe((result) => {
      this.listAllProject = result.map((project) => ({
        ...project,
        listTech: project.listTech.map((item: string) => this.cleanTechList(item)) 
      }));
      this.listAllProject.forEach(element => {
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
    }, (error) => {
      console.error('Error fetching projects:', error);
    });
    this.getDataSource();
  }  

  openSuccessSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }

  AddToImgaeMap(dict: { [key: number]: string[] }, key: number, value: string[]) {
    dict[key] = value;
  }

  AddToEmpMoreMap(dict: { [key: number]: number }, key: number, value: number) {
    dict[key] = value;
  }

  getDataSource(){
    this.data.forEach((empToAdd) => {
      const newElement: EmpElement = {
        emp: empToAdd,
        role: 'Role Name', 
        assignmentDate: new Date().toISOString()
      };
      this.dataSource.data.push(newElement);
    });
    this.dataSource.data.forEach((element, index) => {
      this.secondFormGroup.addControl('id_' + index, this._formBuilder.control(element.emp.id));
      this.secondFormGroup.addControl('name_' + index, this._formBuilder.control(element.emp.firstName));
      this.secondFormGroup.addControl('role_' + index, this._formBuilder.control(element.role, [Validators.required,Validators.pattern('^[a-zA-Z ]+$')]));
      this.secondFormGroup.addControl('assignmentDate_' + index, this._formBuilder.control(element.assignmentDate));
    });
  }

  cleanTechList(item: string): string {
    return item.replace(/[\[\]"]/g, '');
  }

  onDoneClick(): void {
    let empCheck = new Employee()
    this.empsToAddFinal.forEach((emp:AddEmpToProjectDTO)=>{
      this.projectChoosed.tblEmployeeTblProjects.forEach((empExist)=>{
        if (emp.empId === empExist.tblEmployeeId){
          empCheck = empExist.tblEmployee;
        }
      })
    })
    if (empCheck.id > 0){
      this.openSuccessSnackBar(`Have ${empCheck.firstName} already exists in this project`, "Try again")
    } else {
      this.projectService.addEmpsToProject(this.empsToAddFinal, this.projectChoosed.id).subscribe(()=>{
        this.openSuccessSnackBar("Add employee to project successfully", "Done")
        this.dialogRef.close();
      }) 
    } 
  }

  onClickChooseProject(id: number){
    this.listAllProject.map((p:Project)=>{
      if (id===p.id) this.projectChoosed = p
    })
  }

  submitFormValues() {
    this.empsToAddFinal = []
    const updatedData = this.dataSource.data.map((element, index) => ({
      id: this.secondFormGroup.get('id_' + index)?.value,
      role: this.secondFormGroup.get('role_' + index)?.value,
      assignmentDate: this.secondFormGroup.get('assignmentDate_' + index)?.value,
    }));

    updatedData.forEach(element => {
      let empsTemp = new AddEmpToProjectDTO()
      empsTemp.empId = element.id
      empsTemp.role = element.role 
      try {
        empsTemp.assignmentDate = element.assignmentDate.toISOString()
      } catch {
        empsTemp.assignmentDate = element.assignmentDate
      }
      this.empsToAddFinal.push(empsTemp)
    });
  }
}