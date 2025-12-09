import { Component, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'ax-root',
  imports: [RouterLink, RouterOutlet],
  template: `
    <div class="container mx-auto py-8">
      <div class="flow-y-lg">
        <h1>Dynamic UI example</h1>
        <div class="flow-x-md">
          @for (nav of navs(); track nav.route) {
            <a [routerLink]="nav.route" class="btn">{{ nav.label }}</a>
          }
        </div>

        <router-outlet />
      </div>
    </div>
  `,
  styles: [],
})
export class App {
  navs = signal([
    { label: 'Standard Template', route: 'standard-template' },
    { label: 'Component Outlet', route: 'ng-component-outlet' },
  ]);
}
