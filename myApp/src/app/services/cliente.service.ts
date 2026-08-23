import { Injectable, inject } from '@angular/core';
import { Cliente } from '../models/cliente.model';
import { Pet } from '../models/pet.model';
import { StorageService, STORAGE_KEYS } from './storage.service';

@Injectable({
  providedIn: 'root',
})
export class ClienteService {
  private storage = inject(StorageService);

  async getAll(): Promise<Cliente[]> {
    return this.storage.read<Cliente>(STORAGE_KEYS.clientes);
  }

  async getById(id: number): Promise<Cliente | null> {
    return this.storage.read<Cliente>(STORAGE_KEYS.clientes).find((c) => c.id === id) ?? null;
  }

  async insert(cliente: Cliente): Promise<number> {
    const clientes = await this.getAll();
    const novoId = this.storage.nextId(clientes);
    const novoCliente: Cliente = {
      ...cliente,
      id: novoId,
      created_at: new Date().toISOString(),
    };
    this.storage.write(STORAGE_KEYS.clientes, [...clientes, novoCliente]);
    return novoId;
  }

  async update(id: number, cliente: Cliente): Promise<void> {
    const clientes = await this.getAll();
    const atualizados = clientes.map((c) => (c.id === id ? { ...c, ...cliente, id } : c));
    this.storage.write(STORAGE_KEYS.clientes, atualizados);
  }

  async delete(id: number): Promise<void> {
    const clientes = await this.getAll();
    this.storage.write(
      STORAGE_KEYS.clientes,
      clientes.filter((c) => c.id !== id)
    );

    const pets = this.storage.read<Pet>(STORAGE_KEYS.pets);
    this.storage.write(
      STORAGE_KEYS.pets,
      pets.filter((p) => p.cliente_id !== id)
    );
  }

  async search(termo: string): Promise<Cliente[]> {
    const clientes = await this.getAll();
    const t = termo.trim().toLowerCase();
    if (!t) return clientes;

    return clientes.filter(
      (c) =>
        c.nome.toLowerCase().includes(t) ||
        c.telefone.toLowerCase().includes(t) ||
        c.email.toLowerCase().includes(t)
    );
  }
}
