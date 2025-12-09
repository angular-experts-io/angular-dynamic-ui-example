import { Routes } from '@angular/router';

export default <Routes> [
  {
    path: '',
    providers: [],
    children: [
      {
        path: '',
        loadComponent: () => import('./ng-component-outlet').then(m => m.NgComponentOutlet),
      }
    ]
  }
];
