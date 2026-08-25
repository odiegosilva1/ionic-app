import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, RouterModule],
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  email = '';
  senha = '';
  emailTouched = false;

  private authService = inject(AuthService);
  private router = inject(Router);
  private toastController = inject(ToastController);

  get isEmailValid(): boolean {
    return EMAIL_REGEX.test(this.email);
  }

  async onLogin() {
    if (!this.email.trim() || !this.senha.trim()) {
      await this.showToast('Preencha todos os campos', 'warning');
      return;
    }

    if (!this.isEmailValid) {
      await this.showToast('Email inválido', 'warning');
      return;
    }

    const result = await this.authService.login(this.email.trim().toLowerCase(), this.senha);

    if (result.success) {
      await this.showToast(result.message, 'success');
      this.router.navigate(['/tabs/tab1']);
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
