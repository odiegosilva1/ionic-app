import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController, ModalController } from '@ionic/angular';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { PrivacidadePage } from '../../privacidade/privacidade.page';
import { sanitizeInput } from '../../../utils/sanitize';

interface PasswordRule {
  label: string;
  test: (senha: string) => boolean;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

  rules: PasswordRule[] = [
    { label: 'Pelo menos 8 caracteres', test: (s) => s.length >= 8 },
    { label: 'Uma letra maiúscula', test: (s) => /[A-Z]/.test(s) },
    { label: 'Uma letra minúscula', test: (s) => /[a-z]/.test(s) },
    { label: 'Um número', test: (s) => /[0-9]/.test(s) },
    { label: 'Um caractere especial (!@#$%...)', test: (s) => /[^A-Za-z0-9]/.test(s) },
  ];

  private authService = inject(AuthService);
  private router = inject(Router);
  private toastController = inject(ToastController);
  private modalController = inject(ModalController);

  get isEmailValid(): boolean {
    return EMAIL_REGEX.test(this.email);
  }

  get isPasswordValid(): boolean {
    return this.passwordStrength === 5;
  }

  get passwordStrength(): number {
    return this.rules.filter((r) => r.test(this.senha)).length;
  }

  get strengthColor(): string {
    const n = this.passwordStrength;
    if (n <= 2) return 'danger';
    if (n <= 3) return 'warning';
    if (n <= 4) return 'medium';
    return 'success';
  }

  get strengthLabel(): string {
    const n = this.passwordStrength;
    if (n === 0) return '';
    if (n <= 2) return 'Fraca';
    if (n <= 3) return 'Razoável';
    if (n <= 4) return 'Boa';
    return 'Forte';
  }

  ruleMet(rule: PasswordRule): boolean {
    return rule.test(this.senha);
  }

  async openPrivacidade(event: Event): Promise<void> {
    event.preventDefault();
    const modal = await this.modalController.create({
      component: PrivacidadePage,
    });
    await modal.present();
  }

  async onRegister() {
    if (!this.nome.trim()) {
      await this.showToast('Preencha o nome', 'warning');
      return;
    }

    if (!this.email.trim()) {
      await this.showToast('Preencha o email', 'warning');
      return;
    }

    if (!this.isEmailValid) {
      await this.showToast('Email inválido', 'warning');
      return;
    }

    if (!this.senha) {
      await this.showToast('Preencha a senha', 'warning');
      return;
    }

    if (!this.isPasswordValid) {
      await this.showToast('A senha deve atender todos os 5 requisitos de segurança', 'warning');
      return;
    }

    if (this.senha !== this.confirmarSenha) {
      await this.showToast('As senhas não coincidem', 'warning');
      return;
    }

    if (!this.aceiteTermos) {
      this.aceiteTouched = true;
      await this.showToast('Aceite a Política de Privacidade para continuar (LGPD)', 'warning');
      return;
    }

    const result = await this.authService.register({
      nome: sanitizeInput(this.nome.trim()),
      email: this.email.trim().toLowerCase(),
      senha: this.senha,
      aceiteTermos: this.aceiteTermos,
    });

    if (result.success) {
      await this.showToast(result.message, 'success');
      this.router.navigate(['/login']);
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
