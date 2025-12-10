import { Component, computed, linkedSignal, signal, viewChild } from '@angular/core';
import { NgComponentOutlet } from '@angular/common';

import { WIDGET_REGISTRY_SYNC, WidgetRegistrySyncKeys } from '../../ui/widget-registry-sync';

@Component({
  selector: 'ax-ng-component-outlet',
  imports: [NgComponentOutlet],
  template: `
    <div class="flow-y-lg">
      <h2>Standard template</h2>

      <div class="flow-x-md">
        <select #select [value]="widget()" (change)="widget.set($any(select.value))">
          @for (widget of widgets; track widget) {
            <option [value]="widget">Widget {{ widget.toUpperCase() }}</option>
          }
        </select>
        <button type="button" (click)="toggleProjectedContent()">Toggle projected content</button>
      </div>

      <ng-container *ngComponentOutlet="component(); inputs: inputs(); content: content" />
    </div>
  `,
  styles: ``,
})
export class NgComponentOutletExample {
  widgets = ['a', 'b', 'c', 'd'];

  widget = signal<WidgetRegistrySyncKeys>('a');
  component = computed(() => WIDGET_REGISTRY_SYNC[this.widget()]);
  data = signal('Some data');
  dynamicComponent = viewChild(NgComponentOutlet);
  content = [[document.createTextNode('Hello projected world!')]];
  inputs = linkedSignal(() => {
    if (this.widget() === 'a') {
      return {
        data: this.data(),
      };
    } else if (this.widget() === 'b') {
      return {
        dataOther: this.data(),
      };
    } else {
      return {};
    }
  });

  constructor() {
    setInterval(() => {
      this.data.set('Some data ' + new Date().toLocaleTimeString());
    }, 1000);
  }

  toggleProjectedContent() {
    this.content = this.content.length ? [] : [[document.createTextNode('Hello projected world!')]];
  }
}
