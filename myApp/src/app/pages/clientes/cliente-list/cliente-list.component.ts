import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Cliente } from '../../../models/cliente.model';
import { ClienteService } from '../../../services/cliente.service';
import { AuthService } from '../../../services/auth.service';
import { ToastService } from '../../../services/toast.service';

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
  private toast = inject(ToastService);

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
      await this.toast.error('Erro ao carregar clientes');
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
              await this.toast.success('Cliente excluido com sucesso');
              await this.loadClientes();
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

