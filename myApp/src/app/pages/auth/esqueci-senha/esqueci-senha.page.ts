import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

@Component({
  selector: 'app-esqueci-senha',
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, RouterModule],
  templateUrl: './esqueci-senha.page.html',
  styleUrls: ['./esqueci-senha.page.scss'],
})
export class EsqueciSenhaPage {
  email = '';
  emailTouched = false;
  enviado = false;

  private authService = inject(AuthService);
  private router = inject(Router);
  private toastController = inject(ToastController);

  get isEmailValid(): boolean {
    return EMAIL_REGEX.test(this.email);
  }

  async onSubmit() {
    if (!this.email.trim()) {
      await this.showToast('Informe seu email', 'warning');
      return;
    }

    if (!this.isEmailValid) {
      await this.showToast('Email inválido', 'warning');
      return;
    }

    const result = await this.authService.forgotPassword(this.email.trim().toLowerCase());

    if (result.success) {
      this.enviado = true;
    } else {
      await this.showToast(result.message, 'danger');
    }
  }

  private async showToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      color,
      position: 'bottom',
    });
    await toast.present();
  }
}
