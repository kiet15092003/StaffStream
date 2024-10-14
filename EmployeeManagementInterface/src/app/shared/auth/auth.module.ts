import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})
export class Login { 
  username: string;
  password: string;
}

export class Register{
  username: string;
  confirmPassword: string;
  password: string;
}

export class Token{
  token: string;
  expiration: string;
}