// import {
//   afterRenderEffect,
//   Component,
//   computed,
//   input,
//   linkedSignal,
//   signal,
//   untracked,
//   viewChild,
// } from '@angular/core';
//
// import { DASHBOARD_ITEM_REGISTRY } from './dashboard-item-registry';
// import { NgComponentOutlet } from '@angular/common';
// import { Subscription } from 'rxjs';

// @Component({
//   imports: [NgComponentOutlet],
//   template: `<ng-container *ngComponentOutlet="item(); inputs: inputs()" />`,
//   host: { '[style.grid-area]': 'gridArea()' },
// })
// export class DashboardItem {
//   layoutConfig = input.required<LayoutConfig>();
//   dashboardItem = input.required<DashboardItem>();
//   projects = input.required<Project[]>();
//
//   item = computed(() => DASHBOARD_ITEM_REGISTRY[this.dashboardItem().type]);
//   inputs = computed(() => ({
//     data: this.dashboardItem().data,
//     projects: this.projects(),
//   }));
//
//   itemRef = viewChild(NgComponentOutlet);
//   sub?: Subscription;
//   #effectWireUpExportHandler = afterRenderEffect(() => {
//     this.sub?.unsubscribe();
//     const itemRef = this.itemRef();
//     if (this.item() && itemRef) {
//       this.sub = itemRef.componentInstance.export.subscribe((data) => this.handleExport(data));
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
