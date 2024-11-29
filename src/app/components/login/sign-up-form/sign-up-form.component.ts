import { Component } from '@angular/core';
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
  ],
  templateUrl: './sign-up-form.component.html',
  styleUrl: './sign-up-form.component.scss',
})
export class SignUpFormComponent {
  hide: boolean = true; // Estado inicial para ocultar la contraseña
  codeBtnLabel: string = 'Send code';
  codeBtnDisabled: boolean = false;
  codeSent: boolean = false;
  showVerifyError: boolean = false;

  signUpForm: FormGroup = new FormGroup(
    {
      fullname: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
      ]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        passwordValidator()
      ]),
      repeatpassword: new FormControl('', [
        Validators.required,
        matchValidator('password')
      ]),
      code: new FormControl('----', [
        Validators.required,
        isNumber(),
        Validators.minLength(4),
      ]),
    },
  );

  constructor() {
    this.signUpForm.get('password')?.addValidators(matchValidator('repeatpassword', true));
  }

  matcher = new MyErrorStateMatcher();

  sendCode(event: Event) {
    event.preventDefault();
    this.codeSent = true;
    this.codeBtnDisabled = true;
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

  signUp() {
    this.showVerifyError = !this.codeSent;
  }
}
