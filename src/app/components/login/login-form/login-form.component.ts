import { Component, inject } from '@angular/core';
import { CardModule } from 'primeng/card';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {
  FormControl,
  FormGroupDirective,
  NgForm,
  Validators,
  FormsModule,
  ReactiveFormsModule,
  FormGroup,
} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AuthService } from '../../../services/auth/auth.service';
import { Router } from '@angular/router';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    const isSubmitted = form && form.submitted;
    return !!(
      control &&
      control.invalid &&
      (control.dirty || control.touched || isSubmitted)
    );
  }
}

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [
    CardModule,
    MatInputModule,
    MatDividerModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.scss',
})
export class LoginFormComponent {
  hide: boolean = true; // Estado inicial para ocultar la contraseña
  isLoading: boolean = false;

  logInForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
    ]),
  });

  private authServ = inject(AuthService);
  private router = inject(Router);

  onLogin() {
    this.authServ
      .loginUser(
        this.logInForm.get('email')?.value,
        this.logInForm.get('password')?.value
      )
      .subscribe({
        next: (response: any) => {
          // Si la respuesta es exitosa, guardar el token
          const token = response.data.token;
          console.log('logged')
          console.log(response)
          //this.authServ.setToken(token);

          // Redirigir a una página protegida
         this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          console.error('Login failed', error);
        },
      });
  }

  matcher = new MyErrorStateMatcher();
}
