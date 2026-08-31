import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Cliente } from '../../../models/cliente.model';
import { Pet } from '../../../models/pet.model';
import { ClienteService } from '../../../services/cliente.service';
import { PetService } from '../../../services/pet.service';
import { ToastService } from '../../../services/toast.service';

interface RankingItem {
  posicao: number;
  cliente: Cliente;
  pets: Pet[];
}

@Component({
  selector: 'app-cliente-list',
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
  templateUrl: './cliente-list.component.html',
  styleUrls: ['./cliente-list.component.scss'],
})
export class ClienteListComponent implements OnInit {
  ranking: RankingItem[] = [];
  searchTerm = '';

  private clienteService = inject(ClienteService);
  private petService = inject(PetService);
  private router = inject(Router);
  private alertController = inject(AlertController);
  private toast = inject(ToastService);

  async ngOnInit() {
    await this.loadRanking();
  }

  async loadRanking() {
    try {
      const clientes = await this.clienteService.getAll();

      const itens: RankingItem[] = [];
      for (const cliente of clientes) {
        const pets = cliente.id ? await this.petService.getByClienteId(cliente.id) : [];
        itens.push({ posicao: 0, cliente, pets });
      }

      itens.sort((a, b) => b.pets.length - a.pets.length);

      itens.forEach((item, index) => {
        item.posicao = index + 1;
      });

      this.ranking = itens;
    } catch (error) {
      console.error('Erro ao carregar ranking:', error);
      await this.toast.error('Erro ao carregar ranking');
    }
  }

  async onSearch() {
    try {
      const termo = this.searchTerm.trim().toLowerCase();
      if (!termo) {
        await this.loadRanking();
        return;
      }
      const all = this.ranking;
      this.ranking = all
        .filter(
          (item) =>
            item.cliente.nome.toLowerCase().includes(termo) ||
            item.pets.some((p) => p.nome.toLowerCase().includes(termo))
        )
        .map((item, index) => ({ ...item, posicao: index + 1 }));
    } catch (error) {
      console.error('Erro ao buscar:', error);
    }
  }

  async onRefresh(event: any) {
    await this.loadRanking();
    event.target.complete();
  }

  posicaoLabel(posicao: number): string {
    return `${posicao}º`;
  }

  getMedalIcon(posicao: number): string {
    if (posicao === 1) return 'trophy-outline';
    if (posicao === 2) return 'medal-outline';
    if (posicao === 3) return 'medal-outline';
    return 'podium-outline';
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

  goToForm(cliente?: Cliente) {
    if (cliente) {
      this.router.navigate(['/tabs/clientes/form', cliente.id]);
    } else {
      this.router.navigate(['/tabs/clientes/form']);
    }
  }

  goToPet(pet: Pet) {
    if (pet.id != null) {
      this.router.navigate(['/tabs/pets/form', pet.id]);
    }
  }

  async onDelete(cliente: Cliente) {
    const alert = await this.alertController.create({
      header: 'Confirmar exclusao',
      message: `Deseja excluir o cliente "${cliente.nome}"?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Excluir',
          role: 'destructive',
          handler: async () => {
            try {
              await this.clienteService.delete(cliente.id!);
              await this.toast.success('Cliente excluído com sucesso');
              await this.loadRanking();
            } catch (error) {
              console.error('Erro ao excluir cliente:', error);
              await this.toast.error('Erro ao excluir cliente');
            }
          },
        },
      ],
    });

    await alert.present();
  }
}
