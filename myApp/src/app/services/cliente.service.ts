import { Injectable } from '@angular/core';
import { Cliente } from '../models/cliente.model';
import { DatabaseService } from './database.service';

@Injectable({
  providedIn: 'root',
})
export class ClienteService {
  private readonly TABLE = 'clientes';

  constructor(private databaseService: DatabaseService) {}

  async getAll(): Promise<Cliente[]> {
    return this.databaseService.getAll<Cliente>(this.TABLE);
  }

  async getById(id: number): Promise<Cliente | null> {
    return this.databaseService.getById<Cliente>(this.TABLE, id);
  }

  async insert(cliente: Cliente): Promise<number> {
    return this.databaseService.insert(this.TABLE, {
      nome: cliente.nome,
      telefone: cliente.telefone,
      email: cliente.email,
      endereco: cliente.endereco,
    });
  }

  async update(id: number, cliente: Cliente): Promise<void> {
    return this.databaseService.update(this.TABLE, id, {
      nome: cliente.nome,
      telefone: cliente.telefone,
      email: cliente.email,
      endereco: cliente.endereco,
    });
  }

  async delete(id: number): Promise<void> {
    return this.databaseService.delete(this.TABLE, id);
  }

  async search(termo: string): Promise<Cliente[]> {
    if (!termo.trim()) {
      return this.getAll();
    }

    return this.databaseService.query<Cliente>(
      `SELECT * FROM ${this.TABLE} WHERE nome LIKE ? OR telefone LIKE ? OR email LIKE ?`,
      [`%${termo}%`, `%${termo}%`, `%${termo}%`]
    );
  }
}
