import { Component, inject } from '@angular/core';
import {
  MatSnackBar,
  MatSnackBarAction,
  MatSnackBarActions,
  MatSnackBarLabel,
  MatSnackBarRef,
} from '@angular/material/snack-bar';
import {MatButtonModule} from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-success-delete-employee-snackbar',
  standalone: true,
  imports: [MatButtonModule, MatSnackBarLabel, MatSnackBarActions, MatSnackBarAction, MatIconModule],
  templateUrl: './success-delete-employee-snackbar.component.html',
  styleUrl: './success-delete-employee-snackbar.component.css'
})
export class SuccessDeleteEmployeeSnackbarComponent {
  snackBarRef = inject(MatSnackBarRef);
}