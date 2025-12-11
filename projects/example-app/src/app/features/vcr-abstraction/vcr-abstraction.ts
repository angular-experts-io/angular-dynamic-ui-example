import { Component, computed, signal } from '@angular/core';

import { DynamicUiHost } from '../../pattern/dynamic-ui-host';

import {
  WIDGET_REGISTRY_ASYNC_FULL,
  WidgetRegistryAsyncKeys,
} from '../../ui/widget-registry-async';

@Component({
  selector: 'ax-vcr-abstraction',
  imports: [DynamicUiHost],
  template: `
    <div class="flow-y-lg">
      <h2>ViewContainerRef - abstraction</h2>

      <div class="flow-x-md">
        <ng-container
          [axDynamicUiHost]="WIDGET_REGISTRY_ASYNC_FULL"
          [axDynamicUiHostWidgets]="widgetGroupA()"
          [axDynamicUiHostInputSources]="inputSources"
          [axDynamicUiHostOutputHandlers]="outputHandlers"
        />
      </div>
      <div class="flow-y-md">
        <ng-container
          [axDynamicUiHost]="WIDGET_REGISTRY_ASYNC_FULL"
          [axDynamicUiHostWidgets]="widgetGroupB()"
          [axDynamicUiHostInputSources]="inputSources"
          [axDynamicUiHostOutputHandlers]="outputHandlers"
        />
      </div>
      <div class="flow-x-md">
        <button type="button" (click)="toggleWidgets()">Toggle widgets</button>
        <button type="button" (click)="updateData()">Update data</button>
      </div>
    </div>
  `,
  styles: ``,
})
export class VcrAbstraction {
  protected readonly WIDGET_REGISTRY_ASYNC_FULL = WIDGET_REGISTRY_ASYNC_FULL;

  protected readonly widgetGroupA = signal<WidgetRegistryAsyncKeys[]>(['b', 'c']);
  protected readonly widgetGroupB = signal<WidgetRegistryAsyncKeys[]>(['a', 'd']);

  protected readonly inputSources = {
    data: signal('Some data'),
    dataOther: signal('Some dataOther'),
  };

  protected readonly outputHandlers = {
    alert: (message: string) => alert(message),
  };

  x = computed(this.widgetGroupA);

  updateData() {
    this.inputSources.data.set('Some data ' + new Date().toLocaleTimeString());
    this.inputSources.dataOther.set('Some dataOther ' + new Date().toLocaleTimeString());
  }

  toggleWidgets() {
    this.widgetGroupA.update((widgets) => (widgets.length === 1 ? ['b', 'c'] : ['b']));
    this.widgetGroupB.update((widgets) => (widgets.length === 1 ? ['a', 'd'] : ['a']));
  }
}
