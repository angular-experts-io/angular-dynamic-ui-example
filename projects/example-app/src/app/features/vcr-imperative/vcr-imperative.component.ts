import { Component, ComponentRef, DestroyRef, inject, inputBinding, viewChild, ViewContainerRef } from '@angular/core';
import { WIDGET_REGISTRY_ASYNC, WidgetRegistryAsyncKeys } from '../../ui/widget-registry-async';

@Component({
  selector: 'ax-vcr',
  imports: [],
  template: `
    <div class="flow-y-lg">
      <h2>ViewContainerRef - imperative</h2>

      <div class="flow-x-md">
        <ng-template #vcrContainer />
      </div>
    </div>
  `,
  styles: ``,
})
export class VcrImperative {
  protected vcr = viewChild.required('vcrContainer', { read: ViewContainerRef });

  refs: ComponentRef<any>[] = [];

  constructor() {
    const widgets: WidgetRegistryAsyncKeys[] = ['a', 'c'];
    widgets.forEach(async (widget) => {
      const component = await WIDGET_REGISTRY_ASYNC[widget]();
      // const componentRef = this.vcr().createComponent(component, {
      //   bindings: [...(widget === 'a' ? [inputBinding('data', () => 'test')] : [])],
      // });

      const componentRef = this.vcr().createComponent(component);
      if (widget === 'a') {
        componentRef.setInput('data', 'Some data');
      }
      if (widget === 'c') {
        (componentRef.instance as any).alertOld.subscribe((message: any) => {
          alert(message);
        });
      }
      this.refs.push(componentRef);
    });
  }

  #destroy = inject(DestroyRef).onDestroy(() => this.refs.forEach(ref => ref.destroy()));
}
