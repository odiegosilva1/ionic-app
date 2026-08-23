import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { Cliente } from '../../../models/cliente.model';
import { ClienteService } from '../../../services/cliente.service';

@Component({
  selector: 'app-cliente-form',
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
  templateUrl: './cliente-form.component.html',
  styleUrls: ['./cliente-form.component.scss'],
})
export class ClienteFormComponent implements OnInit {
  cliente: Cliente = {
    nome: '',
    telefone: '',
    email: '',
    endereco: '',
  };

  isEditing = false;
  clienteId: number | null = null;

  private clienteService = inject(ClienteService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private toastController = inject(ToastController);

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditing = true;
      this.clienteId = parseInt(id, 10);
      await this.loadCliente();
    }
  }

  async loadCliente() {
    if (this.clienteId) {
      try {
        const cliente = await this.clienteService.getById(this.clienteId);
        if (cliente) {
          this.cliente = cliente;
        }
      } catch (error) {
        console.error('Erro ao carregar cliente:', error);
        await this.showToast('Erro ao carregar cliente', 'danger');
      }
    }
  }

  async onSubmit() {
    if (!this.cliente.nome.trim()) {
      await this.showToast('Nome e obrigatorio', 'warning');
      return;
    }

    try {
      if (this.isEditing && this.clienteId) {
        await this.clienteService.update(this.clienteId, this.cliente);
        await this.showToast('Cliente atualizado com sucesso', 'success');
      } else {
        await this.clienteService.insert(this.cliente);
        await this.showToast('Cliente cadastrado com sucesso', 'success');
      }

      this.router.navigate(['/tabs/clientes']);
    } catch (error) {
      console.error('Erro ao salvar cliente:', error);
      await this.showToast('Erro ao salvar cliente', 'danger');
    }
  }

  onCancel() {
    this.router.navigate(['/tabs/clientes']);
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
