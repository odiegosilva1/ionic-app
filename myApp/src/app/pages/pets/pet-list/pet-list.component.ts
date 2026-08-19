import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, AlertController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { PetComTutor } from '../../models/pet.model';
import { PetService } from '../../services/pet.service';

@Component({
  selector: 'app-pet-list',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: './pet-list.component.html',
  styleUrls: ['./pet-list.component.scss'],
})
export class PetListComponent implements OnInit {
  pets: PetComTutor[] = [];
  searchTerm = '';

  constructor(
    private petService: PetService,
    private router: Router,
    private alertController: AlertController,
    private toastController: ToastController
  ) {}

  async ngOnInit() {
    await this.loadPets();
  }

  async loadPets() {
    try {
      this.pets = await this.petService.getAll();
    } catch (error) {
      console.error('Erro ao carregar pets:', error);
      await this.showToast('Erro ao carregar pets', 'danger');
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
              await this.showToast('Pet excluido com sucesso', 'success');
              await this.loadPets();
            } catch (error) {
              console.error('Erro ao excluir pet:', error);
              await this.showToast('Erro ao excluir pet', 'danger');
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
