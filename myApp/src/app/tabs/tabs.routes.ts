import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

export const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'tab1',
        loadComponent: () =>
          import('../tab1/tab1.page').then((m) => m.Tab1Page),
      },
      {
        path: 'clientes',
        children: [
          {
            path: '',
            loadComponent: () =>
              import('../pages/clientes/cliente-list/cliente-list.component').then(
                (m) => m.ClienteListComponent
              ),
          },
          {
            path: 'form',
            loadComponent: () =>
              import('../pages/clientes/cliente-form/cliente-form.component').then(
                (m) => m.ClienteFormComponent
              ),
          },
          {
            path: 'form/:id',
            loadComponent: () =>
              import('../pages/clientes/cliente-form/cliente-form.component').then(
                (m) => m.ClienteFormComponent
              ),
          },
        ],
      },
      {
        path: 'tab3',
        loadComponent: () =>
          import('../tab3/tab3.page').then((m) => m.Tab3Page),
      },
      {
        path: '',
        redirectTo: '/tabs/tab1',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/tabs/tab1',
    pathMatch: 'full',
  },
];
