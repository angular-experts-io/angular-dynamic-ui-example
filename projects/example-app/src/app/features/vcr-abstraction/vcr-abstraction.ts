import { Component, signal } from '@angular/core';

import { DynamicUiHost } from '../../pattern/dynamic-ui-host';

import { WIDGET_REGISTRY_ASYNC_FULL } from '../../ui/widget-registry-async';

@Component({
  selector: 'ax-vcr-abstraction',
  imports: [DynamicUiHost],
  template: `
    <div class="flow-y-lg">
      <h2>ViewContainerRef - abstraction</h2>

      <div class="flow-x-md">
        <ng-container
          [axDynamicUiHost]="WIDGET_REGISTRY_ASYNC_FULL"
          [axDynamicUiHostWidgets]="['a', 'b', 'c']"
          [axDynamicUiHostInputSources]="inputSources"
          [axDynamicUiHostOutputHandlers]="outputHandlers"
        />
      </div>
    </div>
  `,
  styles: ``,
})
export class VcrAbstraction {
  protected readonly WIDGET_REGISTRY_ASYNC_FULL = WIDGET_REGISTRY_ASYNC_FULL;

  inputSources = {
    data: signal('Some data'),
    dataOther: signal('Some dataOther'),
  }

  outputHandlers = {
    alert: (message: string) => alert(message),
  }
}
