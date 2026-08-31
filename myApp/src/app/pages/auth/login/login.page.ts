import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { ToastService } from '../../../services/toast.service';
import { EMAIL_REGEX } from '../../../utils/email';

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
  showPassword = false;
  loading = false;

  private authService = inject(AuthService);
  private router = inject(Router);
  private toast = inject(ToastService);

  get isEmailValid(): boolean {
    return EMAIL_REGEX.test(this.email);
  }

  async onLogin() {
    if (this.loading) {
      return;
    }

    if (!this.email.trim() || !this.senha.trim()) {
      await this.toast.warning('Preencha todos os campos');
      return;
    }

    if (!this.isEmailValid) {
      await this.toast.warning('Email inválido');
      return;
    }

    this.loading = true;
    const result = await this.authService.login(this.email.trim().toLowerCase(), this.senha);
    this.loading = false;

    if (result.success) {
      await this.toast.success(result.message);
      this.router.navigate(['/tabs/tab1']);
    } else {
      await this.toast.error(result.message);
    }
  }
}
