import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { registerModel } from '../../models/registerModel.interface';
import { ApiResponse } from '../../models/apiResponse.interface';
import { LoginResponse } from '../../models/loginResponse.interface';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly apiUrl = environment.apiUrl.replace(/\/+$/, '');
  private readonly http = inject(HttpClient);

  getVerificationCode(email: string): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/get-code`, { email });
  }

  registerUser(registerData: registerModel): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/register`, registerData);
  }

  loginUser(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { email, password });
  }

  setToken(token: string): void {
    localStorage.setItem('authToken', token);
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }
}
