import { Component, inject } from '@angular/core';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { MatIconModule } from '@angular/material/icon';
import {MatBadgeModule} from '@angular/material/badge';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatMenuModule, MatButtonModule, AvatarModule, BadgeModule, MatIconModule, MatBadgeModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  private router = inject(Router)

  logout() {
    localStorage.clear(); // Limpiar todos los datos almacenados
    this.router.navigate(['']);
  }

}
