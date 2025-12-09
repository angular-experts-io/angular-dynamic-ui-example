import { Component, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

import { routes } from './app.routes';

@Component({
  selector: 'ax-root',
  imports: [RouterLink, RouterOutlet],
  template: `
    <div class="container mx-auto py-8">
      <div class="flow-y-lg">
        <h1>Dynamic UI example</h1>
        <div class="flow-x-md">
          @for (nav of navs(); track nav.path) {
            <a [routerLink]="nav.path" class="btn">{{ nav.title }}</a>
          }
        </div>

        <router-outlet />
      </div>
    </div>
  `,
  styles: [],
})
export class App {
  navs = signal(routes.filter((r) => r.title));
}
