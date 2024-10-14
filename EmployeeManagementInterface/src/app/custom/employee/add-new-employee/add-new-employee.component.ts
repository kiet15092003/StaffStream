import { ChangeDetectionStrategy,Component, inject, OnInit } from '@angular/core';
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
import { MatRadioModule} from '@angular/material/radio';
import { MatCardModule } from '@angular/material/card';
import { Department } from '../../../shared/department/department.model';
import { DepartmentService } from '../../../shared/department/department.service';
import { DomSanitizer } from '@angular/platform-browser';

export interface DialogData {
  employee : Employee
}

@Component({
  selector: 'app-add-new-employee',
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
  templateUrl: './add-new-employee.component.html',
  providers: [provideNativeDateAdapter()],
  styleUrl: './add-new-employee.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class AddNewEmployeeComponent implements OnInit{

  designations : Designation[] = []
  departments : Department[] = []

  readonly dialogRef = inject(MatDialogRef<AddNewEmployeeComponent>);
  empInfo: FormGroup;
  newEmp : AddNewEmployeeDTO = new AddNewEmployeeDTO()
  imageUrl: any = 'https://www.blogoftom.com/wp-content/uploads/2023/09/47086512_portrait-of-a-red-cat-on-a-blurred-background-red-cat-face-the-concept-of-animals-and-pets-orange-tabby-cat-front-view.jpg'; 
  imageFile: File | null = null; 

  constructor(
    private fb: FormBuilder, 
    private designationService: DesignationService,
    private departmentService: DepartmentService,
    private sanitizer: DomSanitizer
  ){
    this.empInfo = this.fb.group({
      firstName:['',Validators.compose([Validators.required,Validators.pattern('^[a-zA-Z ]+$')])],
      lastName: ['',Validators.compose([Validators.required,Validators.pattern('^[a-zA-Z ]+$')])],
      email: ['', Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$')])],
      salary: ['', Validators.compose([Validators.required, Validators.pattern('^[0-9]+$')])],
      hireDate: [new Date()],
      designation: [1],
      department: [1],
      gender: ['male'],
      isMarried: ['1'],
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
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  onImageChange(event: any): void  {
    const file = event.target.files[0];
    if (file) {
      this.imageFile = file;
      this.empInfo.patchValue({ image: file }); // Update form value 
      const reader = new FileReader();
      reader.onload = async () => {
        this.imageUrl = await this.sanitizer.bypassSecurityTrustUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
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
      console.log(formData)
      this.dialogRef.close(this.newEmp);
      
    } else {
      console.log('Form is invalid');
    }
  }
}