import { Type } from '@angular/core';

export const WIDGET_REGISTRY_ASYNC = {
  a: () => import('./widget-a/widget-a').then((m) => m.WidgetA),
  b: () => import('./widget-b/widget-b').then((m) => m.WidgetB),
  c: () => import('./widget-c/widget-c').then((m) => m.WidgetC),
  d: () => import('./widget-d/widget-d').then((m) => m.WidgetD),
} as const;

export const WIDGET_REGISTRY_ASYNC_FULL: WidgetRegistryAsync= {
  a: {
    import: () => import('./widget-a/widget-a').then((m) => m.WidgetA),
    bindings: {
      inputs: ['data'],
    },
  },
  b: {
    import: () => import('./widget-b/widget-b').then((m) => m.WidgetB),
    bindings: {
      inputs: ['dataOther'],
    },
  },
  c: {
    import: () => import('./widget-c/widget-c').then((m) => m.WidgetC),
    bindings: {
      outputs: ['alert']
    },
  },
  d: {
    import: () => import('./widget-d/widget-d').then((m) => m.WidgetD),
    bindings: {
      inputs: [],
    },
  },
} as const;

export type WidgetRegistryAsync = Record<WidgetRegistryAsyncKeys, WidgetConfigFull>

export interface WidgetConfigFull {
  import: () => Promise<Type<any>>;
  bindings: {
    inputs?: string[];
    outputs?: string[];
  };
}

export type WidgetRegistryAsyncKeys = keyof typeof WIDGET_REGISTRY_ASYNC;
