import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {MatTabsModule} from '@angular/material/tabs';
import {FormsModule} from '@angular/forms';
import { LoginFormComponent } from '../../components/login/login-form/login-form.component';
import { SignUpFormComponent } from '../../components/login/sign-up-form/sign-up-form.component';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../../services/auth/auth.service';
import { MessageService } from 'primeng/api';
import { NotificationsService } from '../../services/notifications/notifications.service';
@Component({
  selector: 'app-login-view',
  standalone: true,
  imports: [MatTabsModule, CommonModule, LoginFormComponent, SignUpFormComponent, HttpClientModule],
  templateUrl: './login-view.component.html',
  styleUrl: './login-view.component.scss',
  providers: [AuthService, MessageService, NotificationsService]
})
export class LoginViewComponent {

}
