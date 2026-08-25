import { Injectable } from '@angular/core';

export const STORAGE_KEYS = {
  clientes: 'petshop_clientes',
  pets: 'petshop_pets',
} as const;

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  read<T>(key: string): T[] {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    try {
      return JSON.parse(raw) as T[];
    } catch {
      return [];
    }
  }

  write<T>(key: string, items: T[]): void {
    localStorage.setItem(key, JSON.stringify(items));
  }

  nextId(items: { id?: number }[]): number {
    return items.reduce((max, item) => Math.max(max, item.id ?? 0), 0) + 1;
  }
}
