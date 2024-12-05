import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { registerModel } from '../../models/registerModel.interface';
import { ApiResponse } from '../../models/apiResponse.interface';
import * as jwt_decode from 'jwt-decode';
import { LoginResponse } from '../../models/loginResponse.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl;

  readonly #http = inject(HttpClient);

  getVerificationCode(email: string): Observable<ApiResponse> {
    return this.#http.post<ApiResponse<any>>(`${this.apiUrl}/get-code`, {
      email,
    });
  }

  registerUser(registerData: registerModel): Observable<ApiResponse> {
    return this.#http.post<ApiResponse<any>>(
      `${this.apiUrl}/register`,
      registerData
    );
  }

  loginUser(email: string, password: string): Observable<LoginResponse> {
    return this.#http.post<any>(`${this.apiUrl}/login`, { email, password });
  }

  setToken(token: string) {
    localStorage.setItem('authToken', token); // Guardamos el token en el localStorage
  }

  getToken() {
    return localStorage.getItem('authToken');
  }
}
