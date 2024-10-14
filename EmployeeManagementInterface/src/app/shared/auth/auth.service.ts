import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Login, Token } from './auth.module';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(public myHttp: HttpClient) { }
  authUrl: string = '/api/Auth';

  login(loginInfo: Login) : Observable<Token> {
    return this.myHttp.post<Token>(`${this.authUrl}/login`, loginInfo);
  }
}