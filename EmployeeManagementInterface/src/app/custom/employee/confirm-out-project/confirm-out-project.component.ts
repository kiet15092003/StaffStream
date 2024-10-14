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
  selector: 'app-confirm-out-project',
  standalone: true,
  imports: [
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogTitle,
    MatButtonModule],
  templateUrl: './confirm-out-project.component.html',
  styleUrl: './confirm-out-project.component.css'
})
export class ConfirmOutProjectComponent {
  readonly dialogRef = inject(MatDialogRef<ConfirmOutProjectComponent>);

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  onOkClick(): void {
    this.dialogRef.close(true);
  }
}