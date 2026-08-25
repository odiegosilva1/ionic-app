import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

interface PasswordRule {
  label: string;
  test: (senha: string) => boolean;
}

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

  async onRegister() {
    if (!this.nome.trim() || !this.email.trim() || !this.senha.trim()) {
      await this.showToast('Preencha todos os campos', 'warning');
      return;
    }

    if (this.senha !== this.confirmarSenha) {
      await this.showToast('As senhas não coincidem', 'warning');
      return;
    }

    if (this.passwordStrength < 5) {
      await this.showToast('A senha não atende todos os requisitos de segurança', 'warning');
      return;
    }

    const result = await this.authService.register({
      nome: this.nome,
      email: this.email,
      senha: this.senha,
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
