import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ClienteService } from '../services/cliente.service';
import { PetService } from '../services/pet.service';
import { AuthService } from '../services/auth.service';

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
  userName = '';

  private clienteService = inject(ClienteService);
  private petService = inject(PetService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private alertController = inject(AlertController);

  async ngOnInit() {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.userName = user.nome;
    }
    await this.loadCounts();
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

  novoCliente() {
    this.router.navigate(['/tabs/clientes/form']);
  }

  novoPet() {
    this.router.navigate(['/tabs/pets/form']);
  }

  logout() {
    this.confirmLogout();
  }

  async confirmLogout() {
    const alert = await this.alertController.create({
      header: 'Sair',
      message: 'Deseja realmente sair da conta?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        { text: 'Sair', handler: () => this.authService.logout() },
      ],
    });
    await alert.present();
  }
}
