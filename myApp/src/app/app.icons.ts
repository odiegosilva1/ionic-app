import { addIcons } from 'ionicons';
import {
  add,
  addCircleOutline,
  bugOutline,
  chevronForwardOutline,
  flowerOutline,
  helpCircleOutline,
  homeOutline,
  pawOutline,
  peopleOutline,
  personAddOutline,
  personOutline,
  trash,
  waterOutline,
} from 'ionicons/icons';

/**
 * Registra todos os ícones usados nos templates do app.
 * Em componentes standalone, ícones não registrados não são renderizados.
 */
export function registerAppIcons(): void {
  addIcons({
    add,
    addCircleOutline,
    bugOutline,
    chevronForwardOutline,
    flowerOutline,
    helpCircleOutline,
    homeOutline,
    pawOutline,
    peopleOutline,
    personAddOutline,
    personOutline,
    trash,
    waterOutline,
  });
}
