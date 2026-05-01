import { inject, Injectable } from "@angular/core";
import { NotificationService } from "./notification.service";

@Injectable({
  providedIn: 'root'
})
export class ClipboardService {

  private readonly notification = inject(NotificationService);

  copyToClipboard(id: string): void {
    navigator.clipboard.writeText(id).then(() => {
      console.log('ID copiado para a área de transferência!');
      this.notification.showMessage('ID copiado para a área de transferência', 'snack-success');
    }).catch(err => {
      console.error('Erro ao copiar ID:', err);
      this.notification.showMessage('Erro ao copiar ID', 'snack-error');
    });
  }
}
