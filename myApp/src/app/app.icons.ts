import { addIcons } from 'ionicons';
import {
  add,
  addCircleOutline,
  alertCircleOutline,
  arrowBackOutline,
  bugOutline,
  camera,
  checkmarkCircle,
  chevronForwardOutline,
  close,
  ellipseOutline,
  eyeOutline,
  eyeOffOutline,
  flowerOutline,
  helpCircleOutline,
  homeOutline,
  images,
  keyOutline,
  lockClosedOutline,
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
    arrowBackOutline,
    bugOutline,
    camera,
    checkmarkCircle,
    chevronForwardOutline,
    close,
    ellipseOutline,
    eyeOutline,
    eyeOffOutline,
    flowerOutline,
    helpCircleOutline,
    homeOutline,
    images,
    keyOutline,
    lockClosedOutline,
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
