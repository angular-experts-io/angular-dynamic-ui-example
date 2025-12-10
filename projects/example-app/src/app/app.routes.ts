import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'standard-template',
  },
  {
    path: 'standard-template',
    title: 'Standard Template',
    loadChildren: () => import('./features/standard-template/standard-template.routes'),
  },
  {
    path: 'ng-component-outlet',
    title: 'Component Outlet',
    loadChildren: () => import('./features/ng-component-outlet/ng-component-outlet.routes'),
  },
  {
    path: 'vcr-imperative',
    title: 'VCR Imperative',
    loadChildren: () => import('./features/vcr-imperative/vcr-imperative.routes'),
  },
  {
    path: 'vcr-declarative',
    title: 'VCR declarative',
    loadChildren: () => import('./features/vcr-declarative/vcr-declarative.routes'),
  },
  {
    path: 'vcr-abstraction',
    title: 'VCR abstraction',
    loadChildren: () => import('./features/vcr-abstraction/vcr-abstraction.routes'),
  },
  {
    path: 'html-content',
    title: 'HTML content',
    loadChildren: () => import('./features/html-content/html-content.routes'),
  },
  {
    path: '**',
    redirectTo: 'standard-template',
  },
];
