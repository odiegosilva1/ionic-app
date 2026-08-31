import { Injectable, inject } from '@angular/core';
import { Pet, PetComTutor } from '../models/pet.model';
import { Cliente } from '../models/cliente.model';
import { StorageService, STORAGE_KEYS } from './storage.service';

@Injectable({
  providedIn: 'root',
})
export class PetService {
  private storage = inject(StorageService);

  private async withTutorNome(): Promise<PetComTutor[]> {
    const pets = this.storage.read<Pet>(STORAGE_KEYS.pets);
    if (!pets.length) return [];

    const clientes = await this.storage.read<Cliente>(STORAGE_KEYS.clientes);
    return pets
      .map((pet) => ({
        ...pet,
        tutor_nome: clientes.find((c) => c.id === pet.cliente_id)?.nome,
      }))
      .sort((a, b) => a.nome.localeCompare(b.nome));
  }

  async getAll(): Promise<PetComTutor[]> {
    return this.withTutorNome();
  }

  async getById(id: number): Promise<PetComTutor | null> {
    const pets = await this.withTutorNome();
    return pets.find((p) => p.id === id) ?? null;
  }

  async getByClienteId(clienteId: number): Promise<PetComTutor[]> {
    const pets = await this.withTutorNome();
    return pets.filter((p) => p.cliente_id === clienteId);
  }

  async insert(pet: Pet): Promise<number> {
    const pets = this.storage.read<Pet>(STORAGE_KEYS.pets);
    const novoId = this.storage.nextId(pets);
    const novoPet: Pet = { ...pet, id: novoId, created_at: new Date().toISOString() };
    this.storage.write(STORAGE_KEYS.pets, [...pets, novoPet]);
    return novoId;
  }

  async update(id: number, pet: Pet): Promise<void> {
    const pets = this.storage.read<Pet>(STORAGE_KEYS.pets);
    const atualizados = pets.map((p) => (p.id === id ? { ...p, ...pet, id } : p));
    this.storage.write(STORAGE_KEYS.pets, atualizados);
  }

  async delete(id: number): Promise<void> {
    const pets = this.storage.read<Pet>(STORAGE_KEYS.pets);
    this.storage.write(
      STORAGE_KEYS.pets,
      pets.filter((p) => p.id !== id)
    );
  }

  async toggleCurtida(id: number, usuarioId: string): Promise<boolean> {
    const pets = this.storage.read<Pet>(STORAGE_KEYS.pets);
    const pet = pets.find((p) => p.id === id);
    if (!pet) return false;

    const curtidas = pet.curtidas ?? [];
    const jaCurtiu = curtidas.includes(usuarioId);
    const novasCurtidas = jaCurtiu
      ? curtidas.filter((u) => u !== usuarioId)
      : [...curtidas, usuarioId];

    const atualizados = pets.map((p) =>
      p.id === id ? { ...p, curtidas: novasCurtidas } : p
    );
    this.storage.write(STORAGE_KEYS.pets, atualizados);
    return !jaCurtiu;
  }

  async search(termo: string): Promise<PetComTutor[]> {
    const pets = await this.withTutorNome();
    const t = termo.trim().toLowerCase();
    if (!t) return pets;

    return pets.filter(
      (p) =>
        p.nome.toLowerCase().includes(t) ||
        p.especie.toLowerCase().includes(t) ||
        p.raca.toLowerCase().includes(t) ||
        (p.tutor_nome ?? '').toLowerCase().includes(t)
    );
  }

  async count(): Promise<number> {
    return this.storage.read<Pet>(STORAGE_KEYS.pets).length;
  }
}
