import { Component, EventEmitter, Output, output } from '@angular/core';
import { Card } from '../card/card';

@Component({
  selector: 'ax-widget-c',
  imports: [Card],
  template: `
    <ax-card>
      <div class="flow-y-sm">
        <h4>Widget C</h4>
        <button
          type="button"
          class="btn"
          (click)="alert.emit('Alert from Widget C'); alertOld.emit('Alert from Widget C (OLD)')"
        >
          Alert!
        </button>
      </div>
    </ax-card>
  `,
  styles: ``,
})
export class WidgetC {
  alert = output<string>();
  @Output() alertOld = new EventEmitter<string>();
}
