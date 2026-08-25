import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import { ClienteService } from './cliente.service';

const TOKEN_KEY = 'petshop_token';
const USER_KEY = 'petshop_user';

interface AuthResponse {
  message: string;
  token?: string;
  usuario?: { id: string; nome: string; email: string; created_at: string };
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private clienteService = inject(ClienteService);
  private apiUrl = `${environment.apiUrl}/api/auth`;

  async register(data: { nome: string; email: string; senha: string }): Promise<{ success: boolean; message: string }> {
    try {
      const res = await firstValueFrom(
        this.http.post<AuthResponse>(`${this.apiUrl}/register`, data)
      );
      return { success: true, message: res.message };
    } catch (err: any) {
      const msg = err?.error?.message || 'Erro ao cadastrar';
      return { success: false, message: msg };
    }
  }

  async login(email: string, senha: string): Promise<{ success: boolean; message: string }> {
    try {
      const res = await firstValueFrom(
        this.http.post<AuthResponse>(`${this.apiUrl}/login`, { email, senha })
      );

      if (res.token && res.usuario) {
        localStorage.setItem(TOKEN_KEY, res.token);
        localStorage.setItem(USER_KEY, JSON.stringify(res.usuario));
        await this.ensureCliente(res.usuario);
      }

      return { success: true, message: res.message };
    } catch (err: any) {
      const msg = err?.error?.message || 'Erro ao fazer login';
      return { success: false, message: msg };
    }
  }

  private async ensureCliente(usuario: { id: string; nome: string; email: string }) {
    const existente = await this.clienteService.getByUsuarioId(usuario.id);
    if (!existente) {
      await this.clienteService.insert({
        usuario_id: usuario.id,
        nome: usuario.nome,
        telefone: '',
        email: usuario.email,
        endereco: '',
      });
    }
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  getCurrentUser(): { id: string; nome: string; email: string; created_at: string } | null {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  isLoggedIn(): boolean {
    return this.getToken() !== null && this.getCurrentUser() !== null;
  }
}
