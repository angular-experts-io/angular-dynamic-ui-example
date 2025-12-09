import { Component, input } from '@angular/core';
import { Card } from '../card/card';

@Component({
  selector: 'ax-widget-a',
  imports: [Card],
  template: `
    <ax-card>
      <div class="flow-y-sm">
        <h4>Widget A</h4>
        <p>{{data()}}</p>
      </div>
    </ax-card>
  `,
  styles: ``,
})
export class WidgetA {
  data = input.required<string>();
}
