import { Component } from '@angular/core';
import { Card } from '../card/card';

@Component({
  selector: 'ax-widget-b',
  imports: [Card],
  template: `
    <ax-card>
      <div class="flow-y-sm">
        <h4>Widget B</h4>
      </div>
    </ax-card>
  `,
  styles: ``,
})
export class WidgetB {}
