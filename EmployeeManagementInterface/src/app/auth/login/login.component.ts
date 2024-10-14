import { Component, signal } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../shared/auth/auth.service';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { Login } from '../../shared/auth/auth.module';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    CommonModule,
    MatButtonModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginInfo: FormGroup;
  hide = signal(true);

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.loginInfo = this.fb.group({
      username: ['', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z]+$'),
        Validators.minLength(5),
        Validators.maxLength(20)
      ])],
      password: ['', Validators.compose([
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(16)
      ])]
    });
    // const token = localStorage.getItem('authToken');
    // if (token) {
    //   this.router.navigate(['/']);
    // }
  }

  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  onSubmitFormLogin() {
    let loginData: Login = new Login();
    loginData.username = this.loginInfo.value.username;
    loginData.password = this.loginInfo.value.password;

    this.authService.login(loginData).subscribe({
      next: (response) => {
        console.log('Login successful:', response);     
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('tokenExpiration', response.expiration);
        this.router.navigate(['']);
      },
      error: (err) => {
        console.error('Login failed:', err);
        alert('Login failed. Please check your credentials and try again.');
      },
      complete: () => {
        console.log('Login request completed.');
      }
    });
  }
}