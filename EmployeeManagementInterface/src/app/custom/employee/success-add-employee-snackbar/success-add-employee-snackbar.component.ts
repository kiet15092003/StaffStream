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
  selector: 'app-success-add-employee-snackbar',
  standalone: true,
  imports: [MatButtonModule, MatSnackBarLabel, MatSnackBarActions, MatSnackBarAction, MatIconModule],
  templateUrl: './success-add-employee-snackbar.component.html',
  styleUrl: './success-add-employee-snackbar.component.css'
})
export class SuccessAddEmployeeSnackbarComponent {
  snackBarRef = inject(MatSnackBarRef);
}