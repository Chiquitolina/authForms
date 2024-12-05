import { Component, inject } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { InputOtpModule } from 'primeng/inputotp';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {
  FormGroup,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
  FormGroupDirective,
  NgForm,
} from '@angular/forms';

import { ErrorStateMatcher } from '@angular/material/core';
import { isNumber } from '../../../validators/isNumber';
import { passwordValidator } from '../../../validators/passwordValidator';
import { matchValidator } from '../../../validators/passwordsMatchValidator';
import { AuthService } from '../../../services/auth/auth.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NotificationsService } from '../../../services/notifications/notifications.service';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { registerModel } from '../../../models/registerModel.interface';
import { Location } from '@angular/common';

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
  selector: 'app-sign-up-form',
  standalone: true,
  imports: [
    MatFormFieldModule,
    InputOtpModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    ToastModule,
    ProgressSpinnerModule,
  ],
  templateUrl: './sign-up-form.component.html',
  styleUrl: './sign-up-form.component.scss',
  providers: [],
})
export class SignUpFormComponent {
  hide: boolean = true; // Estado inicial para ocultar la contraseña
  codeBtnLabel: string = 'Send code';
  codeBtnDisabled: boolean = false;
  codeSent: boolean = false;
  showVerifyError: boolean = false;
  sendingCode: boolean = false;
  signingUp: boolean = false;

  signUpForm: FormGroup = new FormGroup({
    email: new FormControl<string>('', [Validators.required, Validators.email]),
    full_name: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
    ]),
    password: new FormControl<string>('', [
      Validators.required,
      Validators.minLength(8),
      passwordValidator(),
    ]),
    confirmPassword: new FormControl<string>('', [
      Validators.required,
      matchValidator('password'),
    ]),
    verification_code: new FormControl<string>('----', [
      Validators.required,
      isNumber(),
      Validators.minLength(4),
    ]),
  });

  private authServ = inject(AuthService);
  private notificationServ = inject(NotificationsService);
  private messageService = inject(MessageService)
  private location = inject(Location)

  constructor() {
    this.signUpForm
      .get('password')
      ?.addValidators(matchValidator('repeatpassword', true));
  }

  matcher = new MyErrorStateMatcher();

  codeCount() {
    this.codeSent = true;
    this.showVerifyError = !this.codeSent;

    // Inicializa el tiempo restante en 60 segundos
    let timeLeft = 59;

    // Actualiza el label del botón con el tiempo restante
    this.codeBtnLabel = `Resend in ${timeLeft}s`;

    // Crea un intervalo que actualice el contador cada segundo
    const interval = setInterval(() => {
      timeLeft--;
      if (timeLeft > 0) {
        this.codeBtnLabel = `Resend in ${timeLeft}s`;
      } else {
        // Detén el intervalo y restablece el botón al estado inicial
        clearInterval(interval);
        this.codeBtnLabel = 'Send Code';
        this.codeBtnDisabled = false;
      }
    }, 1000);
  }


  reloadCurrentRoute() {
    // Vuelve a la misma ubicación (recarga de la URL)
    this.location.go(this.location.path());
    window.location.reload(); // Esto recarga completamente la página
  }

  signUp() {
    this.signingUp = true;
    this.authServ
      .registerUser(this.signUpForm.value as registerModel)
      .subscribe({
        next: () => {
          this.notificationServ.success('', 'User registered succesfully!');
          this.reloadCurrentRoute();
        },
        error: (error) => {
          this.notificationServ.warn('', `${error.error.message}.`);
          this.signingUp = false;
          console.log(error)
        },
      });
  }

  getCode() {
    this.codeBtnDisabled = true;
    this.sendingCode = true;
    this.authServ
      .getVerificationCode(this.signUpForm.get('email')?.value)
      .subscribe({
        next: () => {
          this.codeCount();
          this.notificationServ.success(
            '',
            'Verification code sent successfully'
          );
          this.sendingCode = false;
        },
        error: (error) => {
          this.notificationServ.warn('', `${error.error.message}.`);
          this.sendingCode = false;
          this.codeBtnDisabled = false;
        },
      });
  }
}
