import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { Pet } from '../../../models/pet.model';
import { Cliente } from '../../../models/cliente.model';
import { PetService } from '../../../services/pet.service';
import { ClienteService } from '../../../services/cliente.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-pet-form',
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
  templateUrl: './pet-form.component.html',
  styleUrls: ['./pet-form.component.scss'],
})
export class PetFormComponent implements OnInit {
  pet: Pet = {
    nome: '',
    especie: 'cachorro',
    raca: '',
    idade: 0,
    peso: 0,
    cliente_id: 0,
  };

  clientes: Cliente[] = [];
  meuPerfilId: number | null = null;
  isEditing = false;
  petId: number | null = null;

  especies = [
    { value: 'cachorro', label: 'Cachorro' },
    { value: 'gato', label: 'Gato' },
    { value: 'ave', label: 'Ave' },
    { value: 'peixe', label: 'Peixe' },
    { value: 'reptil', label: 'Reptil' },
    { value: 'outro', label: 'Outro' },
  ];

  private petService = inject(PetService);
  private clienteService = inject(ClienteService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private toastController = inject(ToastController);

  async ngOnInit() {
    await this.loadClientes();

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditing = true;
      this.petId = parseInt(id, 10);
      await this.loadPet();
    } else if (this.meuPerfilId) {
      this.pet.cliente_id = this.meuPerfilId;
    }
  }

  async loadClientes() {
    try {
      const usuario = this.authService.getCurrentUser();
      const todos = await this.clienteService.getAll();

      if (usuario) {
        const meuPerfil = todos.find((c) => c.usuario_id === usuario.id);
        if (meuPerfil?.id) {
          this.meuPerfilId = meuPerfil.id;
        }
      }

      this.clientes = todos;
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
    }
  }

  async loadPet() {
    if (this.petId) {
      try {
        const pet = await this.petService.getById(this.petId);
        if (pet) {
          this.pet = pet;
        }
      } catch (error) {
        console.error('Erro ao carregar pet:', error);
        await this.showToast('Erro ao carregar pet', 'danger');
      }
    }
  }

  async onSubmit() {
    if (!this.pet.nome.trim()) {
      await this.showToast('Nome e obrigatorio', 'warning');
      return;
    }

    if (!this.pet.cliente_id) {
      await this.showToast('Selecione um tutor', 'warning');
      return;
    }

    try {
      if (this.isEditing && this.petId) {
        await this.petService.update(this.petId, this.pet);
        await this.showToast('Pet atualizado com sucesso', 'success');
      } else {
        await this.petService.insert(this.pet);
        await this.showToast('Pet cadastrado com sucesso', 'success');
      }

      this.router.navigate(['/tabs/pets']);
    } catch (error) {
      console.error('Erro ao salvar pet:', error);
      await this.showToast('Erro ao salvar pet', 'danger');
    }
  }

  onCancel() {
    this.router.navigate(['/tabs/pets']);
  }

  private async showToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      color,
      position: 'bottom',
    });
    await toast.present();
  }
}
