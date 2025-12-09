import { Component } from '@angular/core';
import { Card } from '../card/card';

@Component({
  selector: 'ax-widget-d',
  imports: [Card],
  template: `
    <ax-card>
      <div class="flow-y-sm">
        <h4>Widget D</h4>
      </div>
    </ax-card>
  `,
  styles: ``,
})
export class WidgetD {}
