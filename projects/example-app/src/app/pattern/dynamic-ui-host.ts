import {
  afterRenderEffect,
  ComponentRef,
  DestroyRef,
  Directive,
  inject,
  input,
  inputBinding,
  outputBinding,
  Signal,
  ViewContainerRef,
} from '@angular/core';
import { WIDGET_REGISTRY_ASYNC_FULL, WidgetRegistryAsync } from '../ui/widget-registry-async';

@Directive({
  selector: '[axDynamicUiHost]',
})
export class DynamicUiHost {
  #vcr = inject(ViewContainerRef);

  axDynamicUiHost = input.required<WidgetRegistryAsync>();
  axDynamicUiHostWidgets = input.required<(keyof WidgetRegistryAsync)[]>();
  axDynamicUiHostInputSources = input.required<Record<string, Signal<any>>>();
  axDynamicUiHostOutputHandlers = input.required<Record<string, (...props: any) => void>>();

  refs: ComponentRef<any>[] = [];

  #setup = afterRenderEffect(() => {
    this.refs.forEach((ref) => ref.destroy());
    this.axDynamicUiHostWidgets().forEach(async (widget) => {
      const widgetConfig = WIDGET_REGISTRY_ASYNC_FULL[widget];
      const component = await widgetConfig.import();
      const inputBindings = (widgetConfig.bindings.inputs ?? [])
        .map((prop) => {
          const dataSource = (this.axDynamicUiHostInputSources() as any)[prop];
          return dataSource ? inputBinding(prop, dataSource) : undefined;
        })
        .filter((v) => !!v);
      const outputBindings = (widgetConfig.bindings.outputs ?? [])
        .map((prop) => {
          const outputHandler = (this.axDynamicUiHostOutputHandlers() as any)[prop];
          return outputHandler ? outputBinding(prop, outputHandler) : undefined;
        })
        .filter((v) => !!v);
      const componentRef = this.#vcr.createComponent(component, {
        bindings: [...inputBindings, ...outputBindings]
      });

      this.refs.push(componentRef);
    });
  });

  #destroy = inject(DestroyRef).onDestroy(() => this.refs.forEach((ref) => ref.destroy()));
}
