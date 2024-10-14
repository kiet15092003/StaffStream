import { AfterViewInit, Component, inject, signal, ViewChild } from '@angular/core';
import { EmployeeDetailsComponent } from './employee-details/employee-details.component'; 
import { SearchBoxComponent } from '../custom/search-box/search-box.component';
import { MatButtonModule } from '@angular/material/button';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AddNewEmployeeComponent } from '../custom/employee/add-new-employee/add-new-employee.component';
import { AddToProjectComponent } from '../custom/employee/add-to-project/add-to-project.component';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [EmployeeDetailsComponent, SearchBoxComponent,MatButtonModule,MatButtonToggleModule,
    FormsModule, MatIconModule],
  templateUrl: './employee.component.html',
  styleUrl: './employee.component.css'
})
export class EmployeeComponent{
  searchStr: string = ''
  numOfEmps = signal(0)
  confirmDelete: boolean = false
  selectedValue: string = 'all'
  @ViewChild(EmployeeDetailsComponent) employeeDetailsComp!: EmployeeDetailsComponent;
  readonly dialog = inject(MatDialog);

  onRecieveSearchStr(searchTerm: string): void {
    this.searchStr = searchTerm
  }

  onRecieveNumOfEmps(nums: number) : void {
    this.numOfEmps.set(nums)
  }

  onClickButtonMultiDelete(): void {
    this.triggerMultiDeleteInChild(true);
  }
  
  triggerMultiDeleteInChild(confirmDelete: boolean): void {
    if (this.employeeDetailsComp) {
      this.employeeDetailsComp.triggerMultiDelete(confirmDelete);
    }
  }

  onChangeToggle(value: string){
    this.selectedValue = value
    if (this.employeeDetailsComp){
      this.employeeDetailsComp.triggerHandleChangeToggle(this.selectedValue)
    }
  }

  onOpenAddNewEmployeeDialog(): void {
    const dialogRef = this.dialog.open(AddNewEmployeeComponent, {
      minWidth: '800px'
    });
    dialogRef.afterClosed().subscribe(newEmp => {
      console.log(newEmp)
      if (this.employeeDetailsComp) {
        this.employeeDetailsComp.triggerHandleAddNewEmp(newEmp);
      }
    });
  }

  onOpenAddToProjectDialog(): void {
    const dialogRef = this.dialog.open(AddToProjectComponent, {
      minWidth: '1200px',
      data: this.employeeDetailsComp.selection.selected
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result)
      // if (this.employeeDetailsComp) {
      //   this.employeeDetailsComp.triggerHandleAddNewEmp(newEmp);
      // }
    });
  }
}