import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ClienteService } from '../services/cliente.service';
import { PetService } from '../services/pet.service';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';
import { PetComTutor } from '../models/pet.model';

@Component({
  selector: 'app-tab1',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})
export class Tab1Page implements OnInit {
  userName = '';
  meusPets: PetComTutor[] = [];

  private clienteService = inject(ClienteService);
  private petService = inject(PetService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private alertController = inject(AlertController);
  private toast = inject(ToastService);

  async ngOnInit() {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.userName = user.nome;
    }
  }

  async ionViewWillEnter() {
    await this.loadHome();
  }

  async loadHome() {
    try {
      const user = this.authService.getCurrentUser();
      if (!user) return;

      const clientes = await this.clienteService.getAll();
      const meuPerfil = clientes.find((c) => c.usuario_id === user.id);
      if (!meuPerfil?.id) {
        this.meusPets = [];
        return;
      }

      this.meusPets = await this.petService.getByClienteId(meuPerfil.id);
    } catch (error) {
      console.error('Erro ao carregar Home:', error);
      await this.toast.error('Erro ao carregar a Home');
    }
  }

  get petNomeSaudacao(): string {
    return this.meusPets[0]?.nome ?? 'seu pet';
  }

  get petDestaque(): PetComTutor | null {
    return this.meusPets[0] ?? null;
  }

  getEspecieIcon(especie: string): string {
    const icons: Record<string, string> = {
      cachorro: 'paw-outline',
      gato: 'paw-outline',
      ave: 'leaf-outline',
      peixe: 'fish-outline',
      reptil: 'bug-outline',
      outro: 'help-circle-outline',
    };
    return icons[especie] || 'help-circle-outline';
  }

  novoPet() {
    this.router.navigate(['/tabs/pets/form']);
  }

  goToPet(pet: PetComTutor) {
    if (pet.id != null) {
      this.router.navigate(['/tabs/pets/form', pet.id]);
    } else {
      this.router.navigate(['/tabs/pets/form']);
    }
  }

  async onRefresh(event: any) {
    await this.loadHome();
    event.target.complete();
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
