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
  selector: 'app-confirm-edit-emp-in-project',
  standalone: true,
  imports: [
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
  ],
  templateUrl: './confirm-edit-emp-in-project.component.html',
  styleUrl: './confirm-edit-emp-in-project.component.css'
})
export class ConfirmEditEmpInProjectComponent {
  readonly dialogRef = inject(MatDialogRef<ConfirmEditEmpInProjectComponent>);

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  onOkClick(): void {
    this.dialogRef.close(true);
  }
}