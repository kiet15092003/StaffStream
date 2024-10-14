import { AfterViewInit, Component, inject, Input, OnInit, Output, signal, ViewChild, EventEmitter, SimpleChanges } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { EmployeeService } from '../../shared/employee/employee.service';
import { AddNewEmployeeDTO, Employee } from '../../shared/employee/employee.model';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatSort, Sort, MatSortModule } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { DeleteOneDialogComponent } from '../../custom/employee/delete-one-dialog/delete-one-dialog.component';
import {
  MatSnackBar,
} from '@angular/material/snack-bar';
import { SuccessAddEmployeeSnackbarComponent } from '../../custom/employee/success-add-employee-snackbar/success-add-employee-snackbar.component';
import { SuccessDeleteEmployeeSnackbarComponent } from '../../custom/employee/success-delete-employee-snackbar/success-delete-employee-snackbar.component';
import { RouterLink } from '@angular/router';
import {MatMenuModule} from '@angular/material/menu';
import { DeleteMultiEmployeeComponent } from '../../custom/employee/delete-multi-employee/delete-multi-employee.component';

@Component({
  selector: 'app-employee-details',
  standalone: true,
  imports: [
    MatTableModule,
    MatPaginatorModule,
    CommonModule,
    MatButtonModule,
    MatSortModule,
    MatCheckboxModule,
    MatIconModule,
    RouterLink,
    MatMenuModule
  ],
  templateUrl: './employee-details.component.html',
  styleUrls: ['./employee-details.component.css']
})

export class EmployeeDetailsComponent implements AfterViewInit, OnInit {
  displayedColumns: string[] = [
    'select', 'firstName', 'lastName', 'email', 'salary', 'hireDate', 
    'gender', 'designation', 'department' , 'isMarried', 'task'
  ];
  dataSource = new MatTableDataSource<Employee>(); 
  originalData: Employee[] = [];
  selection = new SelectionModel<Employee>(true, []);
  readonly dialog = inject(MatDialog);
  employeeDelete = signal(new Employee());

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @Input() searchStr: string = '';
  @Input() confirmDelete : boolean = false;

  @Output() empsSelectedArr: EventEmitter<number> = new EventEmitter<number>();
  durationInSeconds = 5;

  constructor(
    public empService: EmployeeService, 
    private _liveAnnouncer: LiveAnnouncer,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadEmployees();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadEmployees(): void {
    this.empService.getEmployees().subscribe((employees: Employee[]) => {
      this.dataSource.data = employees;
      this.originalData = [...employees];
    });
  }

  onPassEmp() : void {
    this.empsSelectedArr.emit(this.selection.selected.length);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['searchStr']) {
      this.applyFilter(this.searchStr);
    }
  }

  triggerMultiDelete(confirmDelete: boolean): void {
    if (confirmDelete) {
      this.openDeleteMultiEmployee()
    }
  }
  
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  toggleAllRows() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach(row => this.selection.select(row));
    this.empsSelectedArr.emit(this.selection.selected.length);
  }

  checkboxLabel(row?: Employee): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.firstName}`;
  }

  getSelectedEmployees() : Employee[] {
    return this.selection.selected;
  }

  openDeleteEmployeeDialog(): void {
    const dialogRef = this.dialog.open(DeleteOneDialogComponent, {
      data: { employee: this.employeeDelete() },
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.empService.deleteEmployee(this.employeeDelete().id).subscribe(()=>{
          this.loadEmployees()
        })
        this.openDeleteSuccessSnackBar();
      }
    });
  }

  openDeleteMultiEmployee(){
    const dialogRef = this.dialog.open(DeleteMultiEmployeeComponent, {
});
  
    dialogRef.afterClosed().subscribe(result => {
      let ids : number[] = []
      this.selection.selected.forEach((e:Employee)=>{
        ids.push(e.id)
      })
      this.empService.deleteMultiEmployee(ids).subscribe(()=>{
        this.loadEmployees()
      })
      this.selection.clear();
      this.empsSelectedArr.emit(0);
    });
  }

  triggerHandleChangeToggle(selectedValue: string) {
    this.dataSource.data = this.originalData.filter(
      employee => {
        const dateString = employee.hireDate;
        const date = new Date(dateString);
        const formattedDate = date.toISOString().split('T')[0];
        const currentDate = new Date();
        const currentYear: number = currentDate.getFullYear(); 
        const currentMonth: number = currentDate.getMonth() + 1; 

        if (selectedValue === 'month') {
          return parseInt(formattedDate.split('-')[1], 10) === currentMonth;
        } else if (selectedValue === 'year') {
          return parseInt(formattedDate.split('-')[0], 10) === currentYear;
        } else {
          return true;
        }
      }
    );
    this.selection.clear();
    this.empsSelectedArr.emit(0);
  }

  triggerHandleAddNewEmp(newEmp: any): void {
    console.log(newEmp)
    if (newEmp!==false){
      this.empService.saveEmployee(newEmp).subscribe(() => {
        this.loadEmployees();
      });
      this.openAddSuccessSnackBar();
    }
  }
 
  openAddSuccessSnackBar() {
    this._snackBar.openFromComponent(SuccessAddEmployeeSnackbarComponent, {
      duration: this.durationInSeconds * 1000,
    });
  }

  openDeleteSuccessSnackBar(){
    this._snackBar.openFromComponent(SuccessDeleteEmployeeSnackbarComponent, {
      duration: this.durationInSeconds * 1000,
    });
  }
}