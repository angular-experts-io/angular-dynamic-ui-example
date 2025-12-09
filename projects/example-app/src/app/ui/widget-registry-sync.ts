import { WidgetA } from './widget-a/widget-a';
import { WidgetB } from './widget-b/widget-b';
import { WidgetC } from './widget-c/widget-c';
import { WidgetD } from './widget-d/widget-d';

export const WIDGET_REGISTRY_SYNC = {
  a: WidgetA,
  b: WidgetB,
  c: WidgetC,
  d: WidgetD,
} as const;

export type WidgetRegistrySyncKeys = keyof typeof WIDGET_REGISTRY_SYNC;