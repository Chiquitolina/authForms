import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { HttpClientModule } from '@angular/common/http';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { LoginFormComponent } from '../../components/login/login-form/login-form.component';
import { SignUpFormComponent } from '../../components/login/sign-up-form/sign-up-form.component';
import { AuthService } from '../../services/auth/auth.service';
import { NotificationsService } from '../../services/notifications/notifications.service';

@Component({
  selector: 'app-login-view',
  standalone: true,
  imports: [MatTabsModule, CommonModule, LoginFormComponent, SignUpFormComponent, HttpClientModule, ToastModule],
  templateUrl: './login-view.component.html',
  styleUrl: './login-view.component.scss',
  providers: [AuthService, MessageService, NotificationsService],
})
export class LoginViewComponent {}
