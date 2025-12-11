import {
  afterNextRender,
  afterRenderEffect,
  Component,
  ComponentRef,
  computed,
  DestroyRef,
  Directive,
  effect,
  inject,
  input,
  inputBinding,
  linkedSignal,
  outputBinding,
  Signal,
  signal,
  untracked,
  viewChild,
  ViewContainerRef,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { WIDGET_REGISTRY_ASYNC_FULL, WidgetRegistryAsync } from './ui/widget-registry-async';


@Component({
  imports: [DynamicHost],
  template: `
    <ng-container
      [dynamicHost]="DASHBOARD_ITEM_REGISTRY"
      [dynamicHostType]="dashboardItem().type"
      [dynamicHostInputs]="inputSources"
      [dynamicHostOutputs]="outputHandlers"
    /> 
  `  
})
export class DashboardItem {
  DASHBOARD_ITEM_REGISTRY = DASHBOARD_ITEM_REGISTRY;

  dashboardItem = input.required<DashboardItem>();
  projects = input.required<Project[]>();

  protected readonly inputSources = {
    data: computed(() => this.dashboardItem().data),
    dataOther: computed(this.projects),
  };

  protected readonly outputHandlers = {
    handleExport: (data: ExportData) => { /* ... */ },
  };
}



@Directive({ selector: '[dynamicHost]' })
export class DynamicHost {
  #vcr = inject(ViewContainerRef);
  
  dynamicHost = input.required<DynamicComponentConfig>();
  dynamicHostType = input.required<string>()
  dynamicHostInputs = input.required<Record<string, Signal<any>>>();
  dynamicHostOutputs = input.required<Record<string, (...props: any) => void>>();

  ref?: ComponentRef<any>;
  #setup = afterRenderEffect(async () => {
    this.ref?.destroy()
    const typeConfig = this.dynamicHost()[this.dynamicHostType()];
    const type = await typeConfig.import();

    const inputBindings = typeConfig.inputs.map((prop) => {
      const inputSrc = this.dynamicHostInputs()[prop];
      if (!inputSrc) throw new Error(`Missing data source for input: "${prop}"`);
      return inputBinding(prop, inputSrc);
    });
    const outputBindings = typeConfig.outputs.map((prop) => { /* ... */ });
    // twoWayBindings, directives, ...
    
    this.ref = this.#vcr.createComponent(type, {
      bindings: [
        ...inputBindings,
        ...outputBindings,
        // ...twoWayBindings
      ]
    });
  });

  #destroy = inject(DestroyRef).onDestroy(() => this.ref?.destroy());
}






export const DASHBOARD_ITEM_REGISTRY: DynamicComponentConfig = {
  'item-a': {
    import: () => import('./item/a').then((m) => m.DashboardItemA),
    inputs: ['data', 'projects'],
    outputs: ['export'],
  },
  'item-b': {
    import: () => import('./item/b').then((m) => m.DashboardItemB),
    inputs: ['data', 'projects', 'checks'], // different then above
    outputs: ['export', 'print'],
    // topWay: [],
    // directives: []
  },
  // other items...
} as const;

// lib can deliver registry and components!
export { SALES_ITEM_REGISTRY } from '@my-org/sales-ui';



// @Component({  template: `<ng-template #host />` })
// export class DashboardItem {
//   dashboardItem = input.required<DashboardItem>();
//   projects = input.required<Project[]>();
//
//   vcr = viewChild.required('host', { read: ViewContainerRef });
//
//   ref?: ComponentRef<any>;
//   #setup = afterRenderEffect(async () => {
//     const type = await DASHBOARD_ITEM_REGISTRY[this.dashboardItem().type]();
//     this.ref = this.vcr().createComponent(type, {
//       bindings: [
//         // no need for untracked, it's just an arrow fn definition, it doesn't run at definition time
//         inputBinding('data', () => this.dashboardItem().data),
//         inputBinding('projects', this.projects), // we can pass signal directly
//         outputBinding('export', (data: ExportData) => this.handleExport(data)),
//         // twoWayBinding(...)
//       ],
//       directives: [
//         {
//           type: Drag,
//           bindings: [
//             outputBinding('dropped', (event) => handleDropped(event)),
//           ]
//         }
//       ],
//     });
//   });
//
//   #destroy = inject(DestroyRef).onDestroy(() => this.ref?.destroy());
//
//   handleExport(data: ExportData) { /* ... */ }
//   handleDropped(event: DroppedEvent) { /* ... */ }
// }
//


// @Component({  template: `<ng-template #host />` })
// export class DashboardItem {
//   dashboardItem = input.required<DashboardItem>();
//   projects = input.required<Project[]>();
//
//   vcr = viewChild.required('host', { read: ViewContainerRef });
//
//   ref?: ComponentRef<any>;
//   sub?: Subscription;
//   #setup = afterRenderEffect(async () => {
//     this.#cleanup()
//     const type = await DASHBOARD_ITEM_REGISTRY[this.dashboardItem().type].import();
//     this.ref = this.vcr().createComponent(type);
//     untracked(() => {
//       this.#syncInputs(); // don't trigger setup on input change
//       this.sub = (this.ref.instance as any).export.subscribe((data: ExportData) => handleExport(data))
//     });
//   });
//
//   #destroy = inject(DestroyRef).onDestroy(() => this.#cleanup());
//
//   #effectSyncInputs = effect(() => this.#syncInputs());
//
//   #syncInputs() {
//     this.ref!.setInput('data', untracked(this.dashboardItem).data);
//     this.ref!.setInput('projects', untracked(this.projects));
//   }
//
//   #cleanup() {
//     this.sub?.unsubscribe();
//     this.ref?.destroy();
//   }
//
//   handleExport(data: ExportData) { /* ... */ }
// }



// @Component({
//   imports: [NgComponentOutlet],
//   template: `<ng-container *ngComponentOutlet="type(); inputs: inputs()" />`,
//   host: { '[style.grid-area]': 'gridArea()' },
// })
// export class DashboardItem {
//   layoutConfig = input.required<LayoutConfig>();
//   dashboardItem = input.required<DashboardItem>();
//   projects = input.required<Project[]>();
//
//   type = computed(() => DASHBOARD_ITEM_REGISTRY[this.dashboardItem().type]);
//   inputs = computed(() => ({
//     data: this.dashboardItem().data,
//     projects: this.projects(),
//   }));
//
//   typeRef = viewChild(NgComponentOutlet);
//   sub?: Subscription;
//   #effectWireUpExportHandler = afterRenderEffect(() => {
//     this.sub?.unsubscribe();
//     const typeRef = this.typeRef();
//     if (this.type() && typeRef) {
//       this.sub = typeRef.componentInstance.export.subscribe((data) => this.handleExport(data));
//     }
//   });
//
//   handleExport(data: ExportData) { /* ... */ }
//
//   gridArea = computed(() => { /* ... */ });
// }

// import { Component, computed, input } from '@angular/core';
//
// @Component({
//   template: `
//     @switch (dashboardItem().type) {
//       @case('item-a') {
//         @defer {
//           <item-a [data]="dashboardItem().data" [projects]="projects()" (export)="handleExport($event)" ... />
//         }
//       }
//       @case('item-b') {
//         @defer {
//           <item-b [data]="dashboardItem().data" [projects]="projects()" (export)="handleExport($event)" ... />
//         }
//       }
//       <!-- more item types... -->
//     }
//   `,
//   host: {
//     '[style.grid-area]': 'gridArea()',
//   },
// })
// export class DashboardItem {
//   layoutConfig = input.required<LayoutConfig>();
//   dashboardItem = input.required<DashboardItem>();
//   projects = input.required<Project[]>();
//
//   gridArea = computed(() => {
//     /* ... */
//   });
//
//   handleExport(data: ExportData) {
//     /* ... */
//   }
// }
//
// export interface LayoutConfig {}
// export interface DashboardItem {}
// export interface Project {}
// export interface ExportData {}

// @Component({
//   template: `
//     @switch (dashboardItem().type) {
//       @case('item-a') {
//         @defer { <!-- template based lazy loading since Angular 16 -->
//           <item-a [data]="dashboardItem().data" [projects]="projects()"
//             (export)="handleExport($event)" ... />
//         }
//       }
//       @case('item-b') {
//         @defer { <!-- has to wrap every item, wrapping switch is not enought! -->
//           <item-b [data]="dashboardItem().data" [projects]="projects()"
//             (export)="handleExport($event)" ... />
//         }
//       }
//       <!-- more item types... -->
//     }
//   `,
//   host: {
//     '[style.grid-area]': 'gridArea()',
//   },
// })
// export class DashboardItem {
//   layoutConfig = input.required<LayoutConfig>();
//   dashboardItem = input.required<DashboardItem>();
//   projects = input.required<Project[]>();
//
//   gridArea = computed(() => { /* ... */ });
//
//   handleExport(data: ExportData) { /* ... */ }
// }
