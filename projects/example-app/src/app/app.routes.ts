import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'standard-template'
  },
  {
    path: 'standard-template',
    loadChildren: () => import('./features/standard-template/standard-template.routes')
  }
];
