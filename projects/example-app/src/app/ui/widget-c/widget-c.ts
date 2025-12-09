import { Component } from '@angular/core';
import { Card } from '../card/card';

@Component({
  selector: 'ax-widget-c',
  imports: [Card],
  template: `
    <ax-card>
      <div class="flow-y-sm">
        <h4>Widget C</h4>
      </div>
    </ax-card>
  `,
  styles: ``,
})
export class WidgetC {}
