import { Component, output } from '@angular/core';
import { Card } from '../card/card';

@Component({
  selector: 'ax-widget-c',
  imports: [Card],
  template: `
    <ax-card>
      <div class="flow-y-sm">
        <h4>Widget C</h4>
        <button type="button" class="btn" (click)="alert.emit('Alert from Widget C')">
          Alert!
        </button>
      </div>
    </ax-card>
  `,
  styles: ``,
})
export class WidgetC {
  alert = output<string>();
}
