import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { Cliente } from '../../../models/cliente.model';
import { ClienteService } from '../../../services/cliente.service';
import { ToastService } from '../../../services/toast.service';

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
  loading = false;

  private clienteService = inject(ClienteService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private toast = inject(ToastService);

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
        await this.toast.error('Erro ao carregar cliente');
      }
    }
  }

  async onSubmit() {
    if (this.loading) {
      return;
    }

    if (!this.cliente.nome.trim()) {
      await this.toast.warning('Nome e obrigatorio');
      return;
    }

    this.loading = true;
    try {
      if (this.isEditing && this.clienteId) {
        await this.clienteService.update(this.clienteId, this.cliente);
        await this.toast.success('Cliente atualizado com sucesso');
      } else {
        await this.clienteService.insert(this.cliente);
        await this.toast.success('Cliente cadastrado com sucesso');
      }

      this.router.navigate(['/tabs/clientes']);
    } catch (error) {
      console.error('Erro ao salvar cliente:', error);
      await this.toast.error('Erro ao salvar cliente');
    } finally {
      this.loading = false;
    }
  }

  onCancel() {
    this.router.navigate(['/tabs/clientes']);
  }
}
