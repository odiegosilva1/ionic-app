import { addIcons } from 'ionicons';
import {
  add,
  addCircleOutline,
  alertCircleOutline,
  bugOutline,
  checkmarkCircle,
  chevronForwardOutline,
  close,
  ellipseOutline,
  eyeOutline,
  eyeOffOutline,
  flowerOutline,
  helpCircleOutline,
  homeOutline,
  logOutOutline,
  pawOutline,
  peopleOutline,
  personAddOutline,
  personOutline,
  searchOutline,
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
    alertCircleOutline,
    bugOutline,
    checkmarkCircle,
    chevronForwardOutline,
    close,
    ellipseOutline,
    eyeOutline,
    eyeOffOutline,
    flowerOutline,
    helpCircleOutline,
    homeOutline,
    logOutOutline,
    pawOutline,
    peopleOutline,
    personAddOutline,
    personOutline,
    searchOutline,
    trash,
    waterOutline,
  });
}
