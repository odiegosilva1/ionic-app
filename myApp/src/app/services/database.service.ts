import { Injectable } from '@angular/core';
import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  private sqlite: SQLiteConnection;
  private db: SQLiteDBConnection | null = null;
  private readonly DB_NAME = 'petshop.db';

  constructor() {
    this.sqlite = new SQLiteConnection(CapacitorSQLite);
  }

  async initDatabase(): Promise<void> {
    try {
      const isConnection = await this.sqlite.isConnection(this.DB_NAME, false);

      if (isConnection.result) {
        this.db = await this.sqlite.retrieveConnection(this.DB_NAME, false);
      } else {
        this.db = await this.sqlite.createConnection(this.DB_NAME, false, 'no-encryption', 1, false);
      }

      await this.db.open();

      await this.createTables();

      console.log('Banco de dados inicializado com sucesso');
    } catch (error) {
      console.error('Erro ao inicializar banco de dados:', error);
      throw error;
    }
  }

  private async createTables(): Promise<void> {
    if (!this.db) throw new Error('Banco de dados nao inicializado');

    await this.db.execute(`
      CREATE TABLE IF NOT EXISTS clientes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        telefone TEXT,
        email TEXT,
        endereco TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await this.db.execute(`
      CREATE TABLE IF NOT EXISTS pets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        especie TEXT,
        raca TEXT,
        idade INTEGER,
        peso REAL,
        cliente_id INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE CASCADE
      );
    `);
  }

  async getAll<T>(table: string): Promise<T[]> {
    if (!this.db) throw new Error('Banco de dados nao inicializado');

    const result = await this.db.query(`SELECT * FROM ${table}`);
    return result.values as T[];
  }

  async getById<T>(table: string, id: number): Promise<T | null> {
    if (!this.db) throw new Error('Banco de dados nao inicializado');

    const result = await this.db.query(`SELECT * FROM ${table} WHERE id = ?`, [id]);
    return result.values?.length ? (result.values[0] as T) : null;
  }

  async insert(table: string, data: Record<string, unknown>): Promise<number> {
    if (!this.db) throw new Error('Banco de dados nao inicializado');

    const keys = Object.keys(data);
    const values = Object.values(data);
    const placeholders = keys.map(() => '?').join(', ');

    const sql = `INSERT INTO ${table} (${keys.join(', ')}) VALUES (${placeholders})`;
    const result = await this.db.run(sql, values);

    return result.changes?.lastId ?? 0;
  }

  async update(table: string, id: number, data: Record<string, unknown>): Promise<void> {
    if (!this.db) throw new Error('Banco de dados nao inicializado');

    const keys = Object.keys(data);
    const values = Object.values(data);
    const setClause = keys.map((key) => `${key} = ?`).join(', ');

    const sql = `UPDATE ${table} SET ${setClause} WHERE id = ?`;
    await this.db.run(sql, [...values, id]);
  }

  async delete(table: string, id: number): Promise<void> {
    if (!this.db) throw new Error('Banco de dados nao inicializado');

    await this.db.run(`DELETE FROM ${table} WHERE id = ?`, [id]);
  }

  async query<T>(sql: string, values?: unknown[]): Promise<T[]> {
    if (!this.db) throw new Error('Banco de dados nao inicializado');

    const result = await this.db.query(sql, values);
    return result.values as T[];
  }

  async closeConnection(): Promise<void> {
    if (this.db) {
      await this.sqlite.closeConnection(this.DB_NAME, false);
      this.db = null;
    }
  }
}
