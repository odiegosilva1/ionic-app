import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, AlertController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Cliente } from '../../../models/cliente.model';
import { ClienteService } from '../../../services/cliente.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-cliente-list',
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
  templateUrl: './cliente-list.component.html',
  styleUrls: ['./cliente-list.component.scss'],
})
export class ClienteListComponent implements OnInit {
  clientes: Cliente[] = [];
  meuPerfil: Cliente | null = null;
  searchTerm = '';

  private clienteService = inject(ClienteService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private alertController = inject(AlertController);
  private toastController = inject(ToastController);

  async ngOnInit() {
    await this.loadClientes();
  }

  async loadClientes() {
    try {
      const usuario = this.authService.getCurrentUser();
      const todos = await this.clienteService.getAll();

      if (usuario) {
        this.meuPerfil = todos.find((c) => c.usuario_id === usuario.id) ?? null;
        this.clientes = todos.filter((c) => c.usuario_id !== usuario.id);
      } else {
        this.meuPerfil = null;
        this.clientes = todos;
      }
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
      await this.showToast('Erro ao carregar clientes', 'danger');
    }
  }

  async onSearch() {
    try {
      this.clientes = await this.clienteService.search(this.searchTerm);
    } catch (error) {
      console.error('Erro ao buscar clientes:', error);
    }
  }

  async onRefresh(event: any) {
    await this.loadClientes();
    event.target.complete();
  }

  goToForm(cliente?: Cliente) {
    if (cliente) {
      this.router.navigate(['/tabs/clientes/form', cliente.id]);
    } else {
      this.router.navigate(['/tabs/clientes/form']);
    }
  }

  editMeuPerfil() {
    if (this.meuPerfil) {
      this.router.navigate(['/tabs/clientes/form', this.meuPerfil.id]);
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
              await this.showToast('Cliente excluido com sucesso', 'success');
              await this.loadClientes();
            } catch (error) {
              console.error('Erro ao excluir cliente:', error);
              await this.showToast('Erro ao excluir cliente', 'danger');
            }
          },
        },
      ],
    });

    await alert.present();
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
