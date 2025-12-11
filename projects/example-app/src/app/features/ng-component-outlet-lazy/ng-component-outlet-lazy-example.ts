import {
  afterRenderEffect,
  Component,
  computed,
  effect,
  linkedSignal,
  signal,
  TemplateRef,
  Type,
  untracked,
  viewChild,
} from '@angular/core';
import { NgComponentOutlet } from '@angular/common';

import { WIDGET_REGISTRY_ASYNC, WidgetRegistryAsyncKeys } from '../../ui/widget-registry-async';
import { Subscription } from 'rxjs';

@Component({
  selector: 'ax-ng-component-outlet',
  imports: [NgComponentOutlet],
  template: `
    <div class="flow-y-lg">
      <h2>Component outlet (lazy)</h2>

      <div class="flow-x-md">
        <select #select [value]="widget()" (change)="widget.set($any(select.value))">
          @for (widget of widgets; track widget) {
            <option [value]="widget">Widget {{ widget.toUpperCase() }}</option>
          }
        </select>
        <button type="button" (click)="toggleProjectedContent()">Toggle projected content</button>
      </div>

      <ng-container *ngComponentOutlet="component(); inputs: inputs(); content: content()" />

      <ng-template #projectedContent>
        <div>extra projected content</div>
      </ng-template>
    </div>
  `,
  styles: ``,
})
export class NgComponentOutletLazyExample {
  widgets = ['a', 'b', 'c', 'd'];

  widget = signal<WidgetRegistryAsyncKeys>('a');

  component = signal<Type<any> | null>(null);
  #effectLoadComponent = effect(async () => {
    this.component.set(await WIDGET_REGISTRY_ASYNC[this.widget()]());
  });


  data = signal('Some data');
  dynamicComponent = viewChild(NgComponentOutlet);
  projectedContent = viewChild<TemplateRef<any>>('projectedContent');

  content = signal<any[][]>([[]]);
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

  sub = signal<Subscription | undefined>(undefined);
  #effectTryWireUpOutputs = afterRenderEffect({
    read: () => {
      if (this.component() && this.dynamicComponent()) {
        untracked(this.sub)?.unsubscribe();
        const sub = this.dynamicComponent()?.componentInstance?.alertOld?.subscribe(
          (message: any) => {
            alert(message);
          },
        );
        this.sub.set(sub);
      }
    },
  });

  constructor() {
    setInterval(() => {
      this.data.set('Some data ' + new Date().toLocaleTimeString());
    }, 1000);
  }

  toggleProjectedContent() {
    if (this.content()[0][0]) {
      this.content.set([[]]);
    } else {
      const view = this.projectedContent()?.createEmbeddedView({});
      this.content.set([[view?.rootNodes]]);
    }
  }
}
