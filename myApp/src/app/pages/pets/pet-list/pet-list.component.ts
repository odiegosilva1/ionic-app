import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { PetComTutor } from '../../../models/pet.model';
import { PetService } from '../../../services/pet.service';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-pet-list',
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
  templateUrl: './pet-list.component.html',
  styleUrls: ['./pet-list.component.scss'],
})
export class PetListComponent implements OnInit {
  pets: PetComTutor[] = [];
  searchTerm = '';

  private petService = inject(PetService);
  private router = inject(Router);
  private alertController = inject(AlertController);
  private toast = inject(ToastService);

  async ngOnInit() {
    await this.loadPets();
  }

  async loadPets() {
    try {
      this.pets = await this.petService.getAll();
    } catch (error) {
      console.error('Erro ao carregar pets:', error);
      await this.toast.error('Erro ao carregar pets');
    }
  }

  async onSearch() {
    try {
      this.pets = await this.petService.search(this.searchTerm);
    } catch (error) {
      console.error('Erro ao buscar pets:', error);
    }
  }

  async onRefresh(event: any) {
    await this.loadPets();
    event.target.complete();
  }

  goToForm(pet?: PetComTutor) {
    if (pet) {
      this.router.navigate(['/tabs/pets/form', pet.id]);
    } else {
      this.router.navigate(['/tabs/pets/form']);
    }
  }

  async onDelete(pet: PetComTutor) {
    const alert = await this.alertController.create({
      header: 'Confirmar exclusao',
      message: `Deseja excluir o pet "${pet.nome}"?`,
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
              await this.petService.delete(pet.id!);
              await this.toast.success('Pet excluido com sucesso');
              await this.loadPets();
            } catch (error) {
              console.error('Erro ao excluir pet:', error);
              await this.toast.error('Erro ao excluir pet');
            }
          },
        },
      ],
    });

    await alert.present();
  }

  getEspecieIcon(especie: string): string {
    const icons: Record<string, string> = {
      cachorro: 'bug-outline',
      gato: 'bug-outline',
      ave: 'flower-outline',
      peixe: 'water-outline',
      reptil: 'bug-outline',
      outro: 'help-circle-outline',
    };
    return icons[especie] || 'help-circle-outline';
  }
}

