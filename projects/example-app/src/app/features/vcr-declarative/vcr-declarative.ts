import {
  Component,
  ComponentRef,
  DestroyRef,
  inject,
  inputBinding,
  outputBinding,
  signal,
  viewChild,
  ViewContainerRef,
} from '@angular/core';
import {
  WIDGET_REGISTRY_ASYNC_FULL,
  WidgetRegistryAsyncKeys,
} from '../../ui/widget-registry-async';

@Component({
  selector: 'ax-vcr-declarative',
  imports: [],
  template: `
    <div class="flow-y-lg">
      <h2>ViewContainerRef - declarative</h2>

      <div class="flow-x-md">
        <ng-template #vcrContainer />
      </div>
    </div>
  `,
  styles: ``,
})
export class VcrDeclarative {
  protected vcr = viewChild.required('vcrContainer', { read: ViewContainerRef });

  refs: ComponentRef<any>[] = [];

  dataSources: any = {
    data: signal('Some data'),
    dataOther: signal('Some dataOther'),
  };

  outputHandlers: any = {
    alert: (message: string) => alert(message),
  };

  constructor() {
    const widgets: WidgetRegistryAsyncKeys[] = ['a', 'b', 'c'];
    widgets.forEach(async (widget) => {
      const widgetConfig = WIDGET_REGISTRY_ASYNC_FULL[widget];
      const component = await widgetConfig.import();
      const inputBindings = (widgetConfig.bindings.inputs ?? []).map((prop) => {
        return inputBinding(prop, this.dataSources[prop]);
      });
      const outputBindings = (widgetConfig.bindings.outputs ?? []).map((prop) => {
        return outputBinding(prop, this.outputHandlers[prop]);
      });
      const componentRef = this.vcr().createComponent(component, {
        bindings: [...inputBindings, ...outputBindings],
      });

      this.refs.push(componentRef);
    });
  }

  #destroy = inject(DestroyRef).onDestroy(() => this.refs.forEach((ref) => ref.destroy()));
}
