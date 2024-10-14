import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
@Component({
  selector: 'app-delete-multi-employee',
  standalone: true,
  imports: [
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogTitle,
    MatButtonModule
  ],
  templateUrl: './delete-multi-employee.component.html',
  styleUrl: './delete-multi-employee.component.css'
})
export class DeleteMultiEmployeeComponent {
  readonly dialogRef = inject(MatDialogRef<DeleteMultiEmployeeComponent>);
  
  onNoClick(): void {
    this.dialogRef.close(false);
  }

  onOkClick(): void {
    this.dialogRef.close(true);
  }
}
