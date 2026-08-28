import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-privacidade',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: './privacidade.page.html',
  styleUrls: ['./privacidade.page.scss'],
})
export class PrivacidadePage {
  private modalController = inject(ModalController);

  fechar(): void {
    this.modalController.dismiss();
  }
}
