import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
  MAT_DIALOG_DATA
} from '@angular/material/dialog';
import { Employee } from '../../../shared/employee/employee.model';
export interface DialogData {
  employee : Employee
}

@Component({
  selector: 'app-delete-one-dialog',
  standalone: true,
  imports: [
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
  ],
  templateUrl: './delete-one-dialog.component.html',
  styleUrl: './delete-one-dialog.component.css'
})

export class DeleteOneDialogComponent {
  readonly dialogRef = inject(MatDialogRef<DeleteOneDialogComponent>);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  onOkClick(): void {
    this.dialogRef.close(true);
  }
}