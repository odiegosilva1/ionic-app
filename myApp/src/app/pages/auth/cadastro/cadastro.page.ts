import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { ToastService } from '../../../services/toast.service';
import { PrivacidadePage } from '../../privacidade/privacidade.page';
import { sanitizeInput } from '../../../utils/sanitize';
import { EMAIL_REGEX } from '../../../utils/email';
import {
  getPasswordStrength,
  getStrengthColor,
  getStrengthLabel,
  PASSWORD_RULES,
  PasswordRule,
  ruleMet,
} from '../../../utils/password';

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, RouterModule],
  templateUrl: './cadastro.page.html',
  styleUrls: ['./cadastro.page.scss'],
})
export class CadastroPage {
  nome = '';
  email = '';
  senha = '';
  confirmarSenha = '';
  emailTouched = false;
  showPassword = false;
  showConfirmPassword = false;
  aceiteTermos = false;
  aceiteTouched = false;
  loading = false;

  rules: PasswordRule[] = PASSWORD_RULES;

  private authService = inject(AuthService);
  private router = inject(Router);
  private toast = inject(ToastService);
  private modalController = inject(ModalController);

  get isEmailValid(): boolean {
    return EMAIL_REGEX.test(this.email);
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

  async openPrivacidade(event: Event): Promise<void> {
    event.preventDefault();
    const modal = await this.modalController.create({
      component: PrivacidadePage,
    });
    await modal.present();
  }

  async onRegister() {
    if (this.loading) {
      return;
    }

    if (!this.nome.trim()) {
      await this.toast.warning('Preencha o nome');
      return;
    }

    if (!this.email.trim()) {
      await this.toast.warning('Preencha o email');
      return;
    }

    if (!this.isEmailValid) {
      await this.toast.warning('Email inválido');
      return;
    }

    if (!this.senha) {
      await this.toast.warning('Preencha a senha');
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

    if (!this.aceiteTermos) {
      this.aceiteTouched = true;
      await this.toast.warning('Aceite a Política de Privacidade para continuar (LGPD)');
      return;
    }

    this.loading = true;
    const result = await this.authService.register({
      nome: sanitizeInput(this.nome.trim()),
      email: this.email.trim().toLowerCase(),
      senha: this.senha,
      aceiteTermos: this.aceiteTermos,
    });
    this.loading = false;

    if (result.success) {
      await this.toast.success(result.message);
      this.router.navigate(['/login']);
    } else {
      await this.toast.error(result.message);
    }
  }
}
