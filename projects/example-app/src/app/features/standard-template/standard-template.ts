import { Component, signal } from '@angular/core';

import { WidgetA } from '../../ui/widget-a/widget-a';
import { WidgetB } from '../../ui/widget-b/widget-b';
import { WidgetC } from '../../ui/widget-c/widget-c';
import { WidgetD } from '../../ui/widget-d/widget-d';

@Component({
  selector: 'ax-standard-template',
  imports: [WidgetA, WidgetB, WidgetC, WidgetD],
  template: `
    <div class="flow-y-lg">
      <h2>Standard template</h2>

      <div class="grid grid-cols-2 gap-8">
        <div>
          <h3>Using <code>&#64;if</code></h3>
          <div class="flow-x-lg">
            @for (w of widgets; track w) {
              @defer {
                @if (w === 'a') {
                  <ax-widget-a [data]="data()" />
                } @else if (w === 'b') {
                  <ax-widget-b [dataOther]="dataOther()" />
                } @else if (w === 'c') {
                  <ax-widget-c />
                } @else if (w === 'd') {
                  <ax-widget-d />
                }
              }
            }
          </div>
        </div>
        <div>
          <h3>Using <code>&#64;switch</code></h3>
          <div class="flow-x-lg">
            @for (w of widgets; track w) {
              @defer {
                @switch (w) {
                  @case ('a') {
                    <ax-widget-a [data]="data()" />
                  }
                  @case ('b') {
                    <ax-widget-b [dataOther]="dataOther()" />
                  }
                  @case ('c') {
                    <ax-widget-c (alert)="handlerAlert($event)"/>
                  }
                  @case ('d') {
                    <ax-widget-d />
                  }
                }
              }
            }
          </div>
        </div>
      </div>
    </div>
  `,
  styles: ``,
})
export class StandardTemplate {
  widgets = [
    'a',
    'b',
    'c', 'd'
  ];

  data = signal('Some data');
  dataOther = signal('Other data');

  handlerAlert(message: string) {
    alert(message);
  }
}
