import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { ToastService } from '../../../services/toast.service';
import {
  getPasswordStrength,
  getStrengthColor,
  getStrengthLabel,
  PASSWORD_RULES,
  PasswordRule,
  ruleMet,
} from '../../../utils/password';

@Component({
  selector: 'app-redefinir-senha',
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, RouterModule],
  templateUrl: './redefinir-senha.page.html',
  styleUrls: ['./redefinir-senha.page.scss'],
})
export class RedefinirSenhaPage {
  token = '';
  senha = '';
  confirmarSenha = '';
  showPassword = false;
  showConfirmPassword = false;
  concluido = false;
  loading = false;

  rules: PasswordRule[] = PASSWORD_RULES;

  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private toast = inject(ToastService);

  constructor() {
    this.route.queryParamMap.subscribe((params) => {
      this.token = params.get('token') || '';
    });
  }

  get isPasswordValid(): boolean {
    return this.passwordStrength === 5;
  }

  get passwordStrength(): number {
    return getPasswordStrength(this.senha);
  }

  get strengthColor(): string {
    return getStrengthColor(this.passwordStrength);
  }

  get strengthLabel(): string {
    return getStrengthLabel(this.passwordStrength);
  }

  ruleMet(rule: PasswordRule): boolean {
    return ruleMet(rule, this.senha);
  }

  async onSubmit() {
    if (this.loading) {
      return;
    }

    if (!this.token) {
      await this.toast.error('Link inválido ou expirado');
      return;
    }

    if (!this.senha) {
      await this.toast.warning('Preencha a nova senha');
      return;
    }

    if (!this.isPasswordValid) {
      await this.toast.warning('A senha deve atender todos os 5 requisitos de segurança');
      return;
    }

    if (this.senha !== this.confirmarSenha) {
      await this.toast.warning('As senhas não coincidem');
      return;
    }

    this.loading = true;
    const result = await this.authService.resetPassword(this.token, this.senha);
    this.loading = false;

    if (result.success) {
      this.concluido = true;
    } else {
      await this.toast.error(result.message);
    }
  }
}
