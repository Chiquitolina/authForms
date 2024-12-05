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
import { LoginResponse } from '../../../models/loginResponse.interface';
import { NotificationsService } from '../../../services/notifications/notifications.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

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
    ToastModule,
    ProgressSpinnerModule
  ],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.scss',
})
export class LoginFormComponent {
  hide: boolean = true; // Estado inicial para ocultar la contraseña
  isLoading: boolean = false;
  signingIn:boolean = false;

  logInForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
    ]),
  });

  private authServ = inject(AuthService);
  private router = inject(Router);
  private notificationServ = inject(NotificationsService)
  private messageService = inject(MessageService)

  onLogin() {
    if (this.logInForm.valid) {
      this.signingIn = true;
      this.authServ
      .loginUser(
        this.logInForm.get('email')?.value,
        this.logInForm.get('password')?.value
      )
      .subscribe({
        next: (response: LoginResponse) => {
          this.notificationServ.success('', 'User registered succesfully!');
          const token = response.data.token;
          this.authServ.setToken(token);

          this.router.navigate(['/home']);
        },
        error: (error) => {
          this.notificationServ.warn('', `${error.error.message}.`);
          this.signingIn = false;
        },
      });
    }
  }

  matcher = new MyErrorStateMatcher();
}
