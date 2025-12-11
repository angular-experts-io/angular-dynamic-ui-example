import {
  afterNextRender,
  afterRenderEffect,
  Component,
  ComponentRef,
  DestroyRef,
  effect,
  inject,
  inputBinding,
  signal,
  untracked,
  viewChild,
  ViewContainerRef,
} from '@angular/core';
import { WIDGET_REGISTRY_ASYNC, WidgetRegistryAsyncKeys } from '../../ui/widget-registry-async';
import { Subscription } from 'rxjs';
import { WidgetA } from '../../ui/widget-a/widget-a';

@Component({
  selector: 'ax-vcr',
  imports: [],
  template: `
    <div class="flow-y-lg">
      <h2>ViewContainerRef - imperative</h2>

      <button type="button" (click)="toggleWidgetA()">Toogle Widget A</button>
      
      <div class="flow-x-md">
        <ng-template #vcrContainer />
      </div>
    </div>
  `,
  styles: ``,
})
export class VcrImperative {
  protected vcr = viewChild.required('vcrContainer', { read: ViewContainerRef });


  widgets  = signal<WidgetRegistryAsyncKeys[]>(['a', 'c']);



  refs: ComponentRef<any>[] = [];
  subs: Subscription[] = [];
  #setup = afterRenderEffect(() => {
    console.log('XXX recreate');
    this.#cleanup()
    this.widgets().forEach(async (widget) => {
      const component = await WIDGET_REGISTRY_ASYNC[widget]();
      const componentRef = this.vcr().createComponent(component);
      if (widget === 'a') {
        componentRef.setInput('data', untracked(this.data));
      }
      if (widget === 'c') {
        const sub = (componentRef.instance as any).alertOld.subscribe((message: any) => {
          alert(message);
        });
        this.subs.push(sub);
      }

      this.refs.push(componentRef);
    });
  })

  data = signal('Some data');

  #syncInputs = effect(() => {
    const data = this.data();
    console.log('XXX sync');
    this.refs.forEach((ref) => {
      if (ref.instance.data) {
        ref.setInput('data', data);
      }
    });
  })


  constructor() {
    setInterval(() => {
       this.data.set('Some data ' + new Date().toLocaleTimeString());
    }, 1000)
  }

  #destroy = inject(DestroyRef).onDestroy(() => this.#cleanup());

  #cleanup() {
    this.subs.forEach(sub => sub.unsubscribe());
    this.refs.forEach((ref) => ref.destroy())
  }

  toggleWidgetA() {
    this.widgets.set(this.widgets().includes('a') ? ['c'] : ['a', 'c']);
  }
}
