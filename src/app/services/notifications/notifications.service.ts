import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastComponent } from '../../components/shared/toast/toast.component';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  private messageService = inject(MessageService)


  // Método para mostrar los mensajes
  show(message: string, severity: 'success' | 'error' | 'info' | 'warn', summary: string, detail: string = ''): void {
    this.messageService.add({ severity, summary, detail, life: 3000 }); // Agrega el toast con los parámetros
  }

  // También puedes crear otros métodos, como para el success
  success(message: string, detail: string = ''): void {
    this.show(message, 'success', 'Success', detail);
  }

  error(message: string, detail: string = ''): void {
    this.show(message, 'error', 'Error', detail);
  }

  info(message: string, detail: string = ''): void {
    this.show(message, 'info', 'Info', detail);
  }

  warn(message: string, detail: string = ''): void {
    this.show(message, 'warn', 'Warning', detail);
  }

}
