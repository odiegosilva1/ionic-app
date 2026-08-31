import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ActionSheetController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Pet } from '../../../models/pet.model';
import { Cliente } from '../../../models/cliente.model';
import { PetService } from '../../../services/pet.service';
import { ClienteService } from '../../../services/cliente.service';
import { AuthService } from '../../../services/auth.service';
import { ToastService } from '../../../services/toast.service';

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
  loading = false;

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
  private toast = inject(ToastService);
  private actionSheetController = inject(ActionSheetController);

  get fotoPreview(): string {
    return this.pet.foto ?? '';
  }

  async selectFoto() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Foto do pet',
      buttons: [
        {
          text: 'Tirar foto',
          icon: 'camera',
          handler: () => this.captureFoto(CameraSource.Camera),
        },
        {
          text: 'Escolher da galeria',
          icon: 'images',
          handler: () => this.captureFoto(CameraSource.Photos),
        },
        {
          text: 'Remover foto',
          icon: 'trash',
          role: 'destructive',
          handler: () => {
            this.pet.foto = undefined;
          },
        },
        {
          text: 'Cancelar',
          icon: 'close',
          role: 'cancel',
        },
      ],
    });
    await actionSheet.present();
  }

  async captureFoto(source: CameraSource) {
    try {
      const photo = await Camera.getPhoto({
        quality: 80,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source,
      });
      if (photo.dataUrl) {
        this.pet.foto = photo.dataUrl;
      }
    } catch (error) {
      if ((error as any)?.message === 'User cancelled photos app') {
        return;
      }
      console.error('Erro ao capturar foto:', error);
      await this.toast.error('Erro ao capturar foto');
    }
  }

  async ngOnInit() {
    await this.loadClientes();

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditing = true;
      this.petId = parseInt(id, 10);
      await this.loadPet();
    } else {
      this.resetForm();
      if (this.meuPerfilId) {
        this.pet.cliente_id = this.meuPerfilId;
      }
    }
  }

  resetForm() {
    this.pet = {
      nome: '',
      especie: 'cachorro',
      raca: '',
      idade: 0,
      peso: 0,
      cliente_id: 0,
    };
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
        await this.toast.error('Erro ao carregar pet');
      }
    }
  }

  async onSubmit() {
    if (this.loading) {
      return;
    }

    if (!this.pet.nome.trim()) {
      await this.toast.warning('Nome é obrigatório');
      return;
    }

    if (!this.pet.cliente_id) {
      await this.toast.warning('Selecione um tutor');
      return;
    }

    this.loading = true;
    try {
      if (this.isEditing && this.petId) {
        await this.petService.update(this.petId, this.pet);
        await this.toast.success('Pet atualizado com sucesso');
      } else {
        await this.petService.insert(this.pet);
        await this.toast.success('Pet cadastrado com sucesso');
      }

      this.router.navigate(['/tabs/pets']);
    } catch (error) {
      console.error('Erro ao salvar pet:', error);
      await this.toast.error('Erro ao salvar pet');
    } finally {
      this.loading = false;
    }
  }

  onCancel() {
    this.router.navigate(['/tabs/pets']);
  }
}
