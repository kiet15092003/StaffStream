import { ChangeDetectionStrategy,Component, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatInputModule} from '@angular/material/input';
import { MatFormFieldModule} from '@angular/material/form-field';
import { AddNewEmployeeDTO, Employee } from '../../../shared/employee/employee.model';
import { MatDatepickerModule} from '@angular/material/datepicker';
import { provideNativeDateAdapter} from '@angular/material/core';
import { MatSelectModule} from '@angular/material/select';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Designation } from '../../../shared/designation/designation.model';
import { DesignationService } from '../../../shared/designation/designation.service';
import {MatRadioModule} from '@angular/material/radio';
import { MatCardModule } from '@angular/material/card';
import { Department } from '../../../shared/department/department.model';
import { DepartmentService } from '../../../shared/department/department.service';
import { DomSanitizer } from '@angular/platform-browser';
import { EmployeeService } from '../../../shared/employee/employee.service';

export interface DialogData {
  employee : Employee
}

@Component({
  selector: 'app-edit-employee',
  standalone: true,
  imports: [ 
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatSelectModule,
    ReactiveFormsModule,
    CommonModule,
    MatRadioModule,
    MatCardModule
  ],
  templateUrl: './edit-employee.component.html',
  providers: [provideNativeDateAdapter()],
  styleUrl: './edit-employee.component.css',
})
export class EditEmployeeComponent {
  designations : Designation[] = []
  departments : Department[] = []

  readonly dialogRef = inject(MatDialogRef<EditEmployeeComponent>);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);

  empInfo: FormGroup;
  newEmp : AddNewEmployeeDTO = new AddNewEmployeeDTO()
  imageUrl: any; 
  imageFile: File; 
  haveChangeImage = signal<boolean>(false)

  constructor(
    private fb: FormBuilder, 
    private designationService: DesignationService,
    private departmentService: DepartmentService,
    private sanitizer: DomSanitizer,
    private empService : EmployeeService
  ){
    this.empInfo = this.fb.group({
      firstName:[this.data.employee.firstName,Validators.compose([Validators.required,Validators.pattern('^[a-zA-Z ]+$')])],
      lastName: [this.data.employee.lastName,Validators.compose([Validators.required,Validators.pattern('^[a-zA-Z ]+$')])],
      email: [this.data.employee.email, Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$')])],
      salary: [this.data.employee.salary, Validators.compose([Validators.required, Validators.pattern('^[0-9]+$')])],
      hireDate: [new Date(this.data.employee.hireDate)],
      designation: [this.data.employee.designation.id],
      department: [this.data.employee.department.id],
      gender: [this.data.employee.gender],
      isMarried: [this.data.employee.isMarried.toString()],
      image: []
    })
  }

  ngOnInit(): void {
    this.designationService.getDesignations().subscribe((designations: Designation[])=>{
      this.designations = designations
    })
    this.departmentService.getDepartments().subscribe((departments: Department[])=>{
      this.departments = departments
    })
    this.empService.getEmployeeImgNext(this.data.employee.image).subscribe((blob:Blob)=>{
      this.imageFile = new File([blob], this.data.employee.image, { type: blob.type });
    })
    this.imageUrl = this.data.employee.image
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  onImageChange(event: any): void  {
    const file = event.target.files[0];
    if (file) {
      this.imageFile = file;
      this.empInfo.patchValue({ image: file });
      const reader = new FileReader();
      reader.onload = async () => {
        this.imageUrl = await this.sanitizer.bypassSecurityTrustUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
      this.haveChangeImage.set(true)
    }
  }

  onOkClick(): void {
    if (this.empInfo.valid) {
      const formData = this.empInfo.value;
      this.newEmp.salary = formData.salary;
      this.newEmp.designationId = formData.designation;
      this.newEmp.departmentId = formData.department;
      this.newEmp.hireDate = formData.hireDate.toISOString();
      this.newEmp.email = formData.email;
      this.newEmp.gender = formData.gender;
      this.newEmp.isMarried = parseInt(formData.isMarried)
      this.newEmp.lastName = formData.lastName
      this.newEmp.firstName = formData.firstName
      this.newEmp.image = this.imageFile;
      this.dialogRef.close(this.newEmp);
    } else {
      console.log('Form is invalid');
    }
  }
}
