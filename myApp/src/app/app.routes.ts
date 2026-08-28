import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/auth/login/login.page').then((m) => m.LoginPage),
  },
  {
    path: 'cadastro',
    loadComponent: () =>
      import('./pages/auth/cadastro/cadastro.page').then((m) => m.CadastroPage),
  },
  {
    path: 'esqueci-senha',
    loadComponent: () =>
      import('./pages/auth/esqueci-senha/esqueci-senha.page').then((m) => m.EsqueciSenhaPage),
  },
  {
    path: 'redefinir-senha',
    loadComponent: () =>
      import('./pages/auth/redefinir-senha/redefinir-senha.page').then((m) => m.RedefinirSenhaPage),
  },
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
    canActivate: [authGuard],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
