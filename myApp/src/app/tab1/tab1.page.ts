import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { ClienteService } from '../services/cliente.service';
import { PetService } from '../services/pet.service';
import { DatabaseService } from '../services/database.service';

@Component({
  selector: 'app-tab1',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})
export class Tab1Page implements OnInit {
  totalClientes = 0;
  totalPets = 0;
  isDbReady = false;

  constructor(
    private clienteService: ClienteService,
    private petService: PetService,
    private databaseService: DatabaseService,
    private router: Router
  ) {}

  async ngOnInit() {
    await this.initDatabase();
  }

  async initDatabase() {
    try {
      await this.databaseService.initDatabase();
      this.isDbReady = true;
      await this.loadCounts();
    } catch (error) {
      console.error('Erro ao inicializar banco de dados:', error);
    }
  }

  async loadCounts() {
    try {
      const clientes = await this.clienteService.getAll();
      this.totalClientes = clientes.length;

      const pets = await this.petService.getAll();
      this.totalPets = pets.length;
    } catch (error) {
      console.error('Erro ao carregar contadores:', error);
    }
  }

  goToClientes() {
    this.router.navigate(['/tabs/clientes']);
  }

  goToPets() {
    this.router.navigate(['/tabs/pets']);
  }
}
