import { Component, inject, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputOtpModule } from 'primeng/inputotp';
import { isNumber } from '../../../validators/isNumber';
import { passwordValidator } from '../../../validators/passwordValidator';
import { matchValidator } from '../../../validators/passwordsMatchValidator';
import { AuthService } from '../../../services/auth/auth.service';
import { NotificationsService } from '../../../services/notifications/notifications.service';
import { registerModel } from '../../../models/registerModel.interface';
import { Location } from '@angular/common';

@Component({
  selector: 'app-sign-up-form',
  standalone: true,
  imports: [ReactiveFormsModule, InputOtpModule],
  templateUrl: './sign-up-form.component.html',
  styleUrl: './sign-up-form.component.scss',
})
export class SignUpFormComponent implements OnDestroy {
  hide = true;
  codeBtnLabel = 'Send verification code';
  codeBtnDisabled = false;
  codeSent = false;
  sendingCode = false;
  signingUp = false;

  private codeTimer?: ReturnType<typeof setInterval>;

  signUpForm: FormGroup = new FormGroup({
    email: new FormControl<string>('', [Validators.required, Validators.email]),
    full_name: new FormControl('', [Validators.required, Validators.minLength(2)]),
    password: new FormControl<string>('', [
      Validators.required,
      Validators.minLength(8),
      passwordValidator(),
    ]),
    confirmPassword: new FormControl<string>('', [Validators.required, matchValidator('password')]),
    verification_code: new FormControl<string>('', [
      Validators.required,
      isNumber(),
      Validators.minLength(4),
      Validators.maxLength(4),
    ]),
  });

  private readonly authServ = inject(AuthService);
  private readonly notificationServ = inject(NotificationsService);
  private readonly location = inject(Location);

  constructor() {
    // A change in the original password must also re-validate confirmation.
    this.signUpForm.get('password')?.addValidators(matchValidator('confirmPassword', true));
  }

  ngOnDestroy(): void {
    if (this.codeTimer) clearInterval(this.codeTimer);
  }

  private codeCount(): void {
    this.codeSent = true;
    this.codeBtnDisabled = true;
    if (this.codeTimer) clearInterval(this.codeTimer);
    let timeLeft = 59;
    this.codeBtnLabel = `Resend in ${timeLeft}s`;

    this.codeTimer = setInterval(() => {
      timeLeft--;
      if (timeLeft > 0) {
        this.codeBtnLabel = `Resend in ${timeLeft}s`;
      } else {
        if (this.codeTimer) clearInterval(this.codeTimer);
        this.codeTimer = undefined;
        this.codeBtnLabel = 'Resend verification code';
        this.codeBtnDisabled = false;
      }
    }, 1000);
  }

  private reloadCurrentRoute(): void {
    this.location.go(this.location.path());
    window.location.reload();
  }

  getCode(): void {
    if (this.codeBtnDisabled || this.sendingCode) return;
    const required = ['email', 'password', 'full_name', 'confirmPassword'];
    if (required.some((key) => this.signUpForm.get(key)?.invalid)) {
      required.forEach((key) => this.signUpForm.get(key)?.markAsTouched());
      return;
    }
    this.sendingCode = true;
    this.codeBtnDisabled = true;
    this.authServ.getVerificationCode(this.signUpForm.get('email')?.value).subscribe({
      next: () => {
        this.codeCount();
        this.notificationServ.success('', 'Verification code sent successfully.');
        this.sendingCode = false;
      },
      error: (error) => {
        this.notificationServ.warn('', error?.error?.message || 'Could not send the code. Please try again.');
        this.sendingCode = false;
        this.codeBtnDisabled = false;
      },
    });
  }

  signUp(): void {
    if (this.signingUp) return;
    if (!this.codeSent || this.signUpForm.invalid) {
      this.signUpForm.markAllAsTouched();
      return;
    }
    this.signingUp = true;
    this.authServ.registerUser(this.signUpForm.value as registerModel).subscribe({
      next: () => {
        this.notificationServ.success('', 'Account created successfully!');
        this.reloadCurrentRoute();
      },
      error: (error) => {
        this.notificationServ.warn('', error?.error?.message || 'Could not create the account. Please try again.');
        this.signingUp = false;
      },
    });
  }
}
