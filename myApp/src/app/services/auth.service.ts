import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario } from '../models/usuario.model';
import { StorageService, STORAGE_KEYS } from './storage.service';

const STORAGE_KEY = 'petshop_usuarios';
const SESSION_KEY = 'petshop_session';
const HASH_PREFIX = 'sha256:';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private storage = inject(StorageService);
  private router = inject(Router);

  private async hashPassword(password: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return HASH_PREFIX + hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  }

  async register(usuario: Omit<Usuario, 'id' | 'created_at'>): Promise<{ success: boolean; message: string }> {
    const usuarios = this.storage.read<Usuario>(STORAGE_KEY);

    if (usuarios.some((u) => u.email.toLowerCase() === usuario.email.toLowerCase())) {
      return { success: false, message: 'Email já cadastrado' };
    }

    const hashedSenha = await this.hashPassword(usuario.senha);
    const novoId = this.storage.nextId(usuarios);
    const novoUsuario: Usuario = {
      ...usuario,
      senha: hashedSenha,
      id: novoId,
      created_at: new Date().toISOString(),
    };

    this.storage.write(STORAGE_KEY, [...usuarios, novoUsuario]);
    return { success: true, message: 'Cadastro realizado com sucesso' };
  }

  async login(email: string, senha: string): Promise<{ success: boolean; message: string }> {
    const usuarios = this.storage.read<Usuario>(STORAGE_KEY);
    const hashedSenha = await this.hashPassword(senha);

    const usuario = usuarios.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.senha === hashedSenha
    );

    if (!usuario) {
      return { success: false, message: 'Email ou senha incorretos' };
    }

    const { senha: _, ...session } = usuario;
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    return { success: true, message: 'Login realizado com sucesso' };
  }

  logout(): void {
    localStorage.removeItem(SESSION_KEY);
    this.router.navigate(['/login']);
  }

  getCurrentUser(): Omit<Usuario, 'senha'> | null {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as Omit<Usuario, 'senha'>;
    } catch {
      return null;
    }
  }

  isLoggedIn(): boolean {
    return this.getCurrentUser() !== null;
  }
}
