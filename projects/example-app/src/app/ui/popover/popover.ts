import {
  DestroyRef,
  Directive,
  effect,
  ElementRef,
  inject,
  input,
  output,
  signal,
  TemplateRef,
  untracked,
  ViewContainerRef,
} from '@angular/core';
import { TemplatePortal } from '@angular/cdk/portal';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { Subscription } from 'rxjs';

@Directive({
  selector: '[axPopover]',
  host: {
    '(click)': 'handleClick($event)',
  },
})
export class Popover {
  #destroyRef = inject(DestroyRef);
  #vcr = inject(ViewContainerRef);
  #overlay = inject(Overlay);
  host = inject(ElementRef);

  portal: TemplatePortal<TemplateRef<any>> | undefined;
  overlayRef: OverlayRef | undefined;
  overlayRefSubscriptions: Subscription | undefined;

  axPopover = input.required<TemplateRef<any>>();
  axPopoverContext = input<{ [key: string]: any }>();

  opened = output<void>();
  closed = output<void>();

  expanded = signal(false);

  #effectCreateOverlay = effect(() => {
    if (!this.axPopover()) {
      throw new Error(
        'Please provide [axPopover]="someTemplateRef" which is required to open a axPopover.',
      );
    }
    if (this.overlayRef) {
      this.overlayRef.detach();
      this.overlayRef.dispose();
    }
    if (this.overlayRefSubscriptions) {
      this.overlayRefSubscriptions.unsubscribe();
    }
    this.portal = new TemplatePortal(this.axPopover()!, this.#vcr, {
      $implicit: this,
      ...untracked(this.axPopoverContext),
    });

    this.overlayRef = this.#overlay.create({
      hasBackdrop: true,
      backdropClass: 'ax-popover-backdrop',
      scrollStrategy: this.#overlay.scrollStrategies.reposition({
        autoClose: true,
        scrollThrottle: 100,
      }),
      positionStrategy: this.#overlay
        .position()
        .flexibleConnectedTo(this.host)
        .withPositions([
          {
            panelClass: 'ax-popover-top-center',
            originX: 'center',
            originY: 'top',
            overlayX: 'center',
            overlayY: 'bottom',
            offsetY: -20,
          },
        ])
        .withLockedPosition(false)
        .withFlexibleDimensions(true)
        .withPush(false)
        .withViewportMargin(20),
    });

    this.overlayRefSubscriptions = this.overlayRef.detachments().subscribe(() => {
      this.expanded.set(false);
    });

    this.overlayRefSubscriptions.add(this.overlayRef.backdropClick().subscribe(() => this.close()));
  });

  #destroy = this.#destroyRef.onDestroy(() => {
    if (this.portal && this.portal.isAttached) {
      this.portal.detach();
    }
    if (this.overlayRef) {
      if (this.overlayRef.hasAttached()) {
        this.overlayRef.detach();
      }
      this.overlayRef.dispose();
    }
  });

  handleClick($event: Event) {
    $event.stopPropagation();
    if (!this.expanded()) {
      this.open();
      return;
    }

    if (this.expanded()) {
      this.close();
    }
  }

  open() {
    if (this.overlayRef?.hasAttached()) {
      return;
    }
    this.overlayRef?.attach(this.portal);
    this.expanded.set(true);
    this.opened.emit();
  }

  close() {
    if (this.overlayRef?.hasAttached()) {
      this.expanded.set(false);
      this.overlayRef.detach();
      this.closed.emit();
    }
  }
}
