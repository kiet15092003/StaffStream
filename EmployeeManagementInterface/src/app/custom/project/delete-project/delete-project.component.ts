import { Component,inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';

@Component({
  selector: 'app-delete-project',
  standalone: true,
  imports: [
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogTitle,
    MatButtonModule
  ],
  templateUrl: './delete-project.component.html',
  styleUrl: './delete-project.component.css'
})

export class DeleteProjectComponent {
  readonly dialogRef = inject(MatDialogRef<DeleteProjectComponent>);

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  onOkClick(): void {
    this.dialogRef.close(true);
  }
}