import { Routes } from '@angular/router';
import { LoginViewComponent } from './views/login-view/login-view.component';
import { HomeComponent } from './components/home/home.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: LoginViewComponent },
  { path: 'home', component: HomeComponent, canActivate: [authGuard] },
];
