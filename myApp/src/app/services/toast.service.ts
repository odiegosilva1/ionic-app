import { Injectable, inject } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({ providedIn: 'root' })
export class ToastService {
  private toastController = inject(ToastController);

  async show(message: string, color = 'primary', duration = 2000): Promise<void> {
    const toast = await this.toastController.create({
      message,
      duration,
      color,
      position: 'bottom',
    });
    await toast.present();
  }

  success(message: string): Promise<void> {
    return this.show(message, 'success');
  }

  warning(message: string): Promise<void> {
    return this.show(message, 'warning');
  }

  error(message: string): Promise<void> {
    return this.show(message, 'danger');
  }
}
