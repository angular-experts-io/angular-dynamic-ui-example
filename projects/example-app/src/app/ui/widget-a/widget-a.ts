import {
  afterRenderEffect,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  input,
  viewChild,
} from '@angular/core';

import { Card } from '../card/card';

@Component({
  selector: 'ax-widget-a',
  imports: [Card],
  template: `
    <ax-card>
      <div class="flow-y-sm">
        <h4>Widget A</h4>
        <p>{{ data() }}</p>
        <div
          #projectedContent
          class="card-dashed"
          [class.hidden]="!projectedContentRef().nativeElement.hasChildNodes()"
        >
          <ng-content />
        </div>
      </div>
    </ax-card>
  `,
  styles: ``,
})
export class WidgetA {
  data = input.required<string>();

  projectedContentRef = viewChild.required<ElementRef>('projectedContent');

  constructor() {
    console.log('[WidgetA] created');
  }

  #onDestroy = inject(DestroyRef).onDestroy(() => console.log('[WidgetA] destroyed'));
}
