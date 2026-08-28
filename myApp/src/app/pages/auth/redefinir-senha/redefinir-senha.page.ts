import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

interface PasswordRule {
  label: string;
  test: (senha: string) => boolean;
}

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

  rules: PasswordRule[] = [
    { label: 'Pelo menos 8 caracteres', test: (s) => s.length >= 8 },
    { label: 'Uma letra maiúscula', test: (s) => /[A-Z]/.test(s) },
    { label: 'Uma letra minúscula', test: (s) => /[a-z]/.test(s) },
    { label: 'Um número', test: (s) => /[0-9]/.test(s) },
    { label: 'Um caractere especial (!@#$%...)', test: (s) => /[^A-Za-z0-9]/.test(s) },
  ];

  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private toastController = inject(ToastController);

  constructor() {
    this.route.queryParamMap.subscribe((params) => {
      this.token = params.get('token') || '';
    });
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

  async onSubmit() {
    if (!this.token) {
      await this.showToast('Link inválido ou expirado', 'danger');
      return;
    }

    if (!this.senha) {
      await this.showToast('Preencha a nova senha', 'warning');
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

    const result = await this.authService.resetPassword(this.token, this.senha);

    if (result.success) {
      this.concluido = true;
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
