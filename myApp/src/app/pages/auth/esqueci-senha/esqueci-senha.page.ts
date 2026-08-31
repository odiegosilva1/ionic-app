import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { ToastService } from '../../../services/toast.service';
import { EMAIL_REGEX } from '../../../utils/email';

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
  loading = false;

  private authService = inject(AuthService);
  private router = inject(Router);
  private toast = inject(ToastService);

  get isEmailValid(): boolean {
    return EMAIL_REGEX.test(this.email);
  }

  async onSubmit() {
    if (this.loading) {
      return;
    }

    if (!this.email.trim()) {
      await this.toast.warning('Informe seu email');
      return;
    }

    if (!this.isEmailValid) {
      await this.toast.warning('Email inválido');
      return;
    }

    this.loading = true;
    const result = await this.authService.forgotPassword(this.email.trim().toLowerCase());
    this.loading = false;

    if (result.success) {
      this.enviado = true;
    } else {
      await this.toast.error(result.message);
    }
  }
}
