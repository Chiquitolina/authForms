import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth/auth.service';
import { Router } from '@angular/router';
import { LoginResponse } from '../../../models/loginResponse.interface';
import { NotificationsService } from '../../../services/notifications/notifications.service';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.scss',
})
export class LoginFormComponent {
  hide = true;
  signingIn = false;

  logInForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
  });

  private readonly authServ = inject(AuthService);
  private readonly router = inject(Router);
  private readonly notificationServ = inject(NotificationsService);

  onLogin(): void {
    if (this.signingIn) return;
    if (this.logInForm.invalid) {
      this.logInForm.markAllAsTouched();
      return;
    }

    this.signingIn = true;
    this.authServ.loginUser(
      this.logInForm.get('email')?.value,
      this.logInForm.get('password')?.value
    ).subscribe({
      next: (response: LoginResponse) => {
        this.authServ.setToken(response.data.token);
        this.notificationServ.success('', 'Signed in successfully!');
        this.router.navigate(['/home']);
      },
      error: (error) => {
        this.notificationServ.warn('', error?.error?.message || 'Could not sign in. Please try again.');
        this.signingIn = false;
      },
    });
  }
}
