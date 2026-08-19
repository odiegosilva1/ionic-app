import { Injectable } from '@angular/core';
import { Pet, PetComTutor } from '../models/pet.model';
import { DatabaseService } from './database.service';

@Injectable({
  providedIn: 'root',
})
export class PetService {
  private readonly TABLE = 'pets';

  constructor(private databaseService: DatabaseService) {}

  async getAll(): Promise<PetComTutor[]> {
    return this.databaseService.query<PetComTutor>(
      `SELECT p.*, c.nome as tutor_nome
       FROM ${this.TABLE} p
       LEFT JOIN clientes c ON p.cliente_id = c.id
       ORDER BY p.nome`
    );
  }

  async getById(id: number): Promise<PetComTutor | null> {
    return this.databaseService.query<PetComTutor>(
      `SELECT p.*, c.nome as tutor_nome
       FROM ${this.TABLE} p
       LEFT JOIN clientes c ON p.cliente_id = c.id
       WHERE p.id = ?`,
      [id]
    ).then((results) => results[0] || null);
  }

  async getByClienteId(clienteId: number): Promise<PetComTutor[]> {
    return this.databaseService.query<PetComTutor>(
      `SELECT p.*, c.nome as tutor_nome
       FROM ${this.TABLE} p
       LEFT JOIN clientes c ON p.cliente_id = c.id
       WHERE p.cliente_id = ?
       ORDER BY p.nome`,
      [clienteId]
    );
  }

  async insert(pet: Pet): Promise<number> {
    return this.databaseService.insert(this.TABLE, {
      nome: pet.nome,
      especie: pet.especie,
      raca: pet.raca,
      idade: pet.idade,
      peso: pet.peso,
      cliente_id: pet.cliente_id,
    });
  }

  async update(id: number, pet: Pet): Promise<void> {
    return this.databaseService.update(this.TABLE, id, {
      nome: pet.nome,
      especie: pet.especie,
      raca: pet.raca,
      idade: pet.idade,
      peso: pet.peso,
      cliente_id: pet.cliente_id,
    });
  }

  async delete(id: number): Promise<void> {
    return this.databaseService.delete(this.TABLE, id);
  }

  async search(termo: string): Promise<PetComTutor[]> {
    if (!termo.trim()) {
      return this.getAll();
    }

    return this.databaseService.query<PetComTutor>(
      `SELECT p.*, c.nome as tutor_nome
       FROM ${this.TABLE} p
       LEFT JOIN clientes c ON p.cliente_id = c.id
       WHERE p.nome LIKE ? OR p.especie LIKE ? OR p.raca LIKE ? OR c.nome LIKE ?
       ORDER BY p.nome`,
      [`%${termo}%`, `%${termo}%`, `%${termo}%`, `%${termo}%`]
    );
  }

  async count(): Promise<number> {
    const result = await this.databaseService.query<{ total: number }>(
      `SELECT COUNT(*) as total FROM ${this.TABLE}`
    );
    return result[0]?.total ?? 0;
  }
}
