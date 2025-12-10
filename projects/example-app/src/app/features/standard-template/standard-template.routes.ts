import { Routes } from '@angular/router';

export default <Routes>[
  {
    path: '',
    providers: [],
    children: [
      {
        path: '',
        loadComponent: () => import('./standard-template').then((m) => m.StandardTemplate),
      },
    ],
  },
];
