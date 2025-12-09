import { Routes } from '@angular/router';

export default <Routes> [
  {
    path: '',
    providers: [],
    children: [
      {
        path: '',
        loadComponent: () => import('./vcr-imperative.component').then(m => m.VcrImperative),
      }
    ]
  }
];
