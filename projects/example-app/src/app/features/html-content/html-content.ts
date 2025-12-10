import {
  afterNextRender,
  ApplicationRef,
  Component,
  createComponent,
  DestroyRef,
  ElementRef,
  inject,
  inputBinding,
  outputBinding,
  signal,
  TemplateRef,
  viewChild,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { Popover } from '../../ui/popover/popover';
import { Card } from '../../ui/card/card';

@Component({
  selector: 'ax-html-content',
  imports: [Card],
  template: `
    <div class="flow-y-lg">
      <h2>HTML content</h2>

      <div #content [innerHTML]="html"></div>

      <ng-template #feedback let-content="content">
        <ax-card>{{ content }} clicked</ax-card>
      </ng-template>
    </div>
  `,
  styles: ``,
})
export class HtmlContent {
  #appRef = inject(ApplicationRef);
  #sanitizer = inject(DomSanitizer);

  contentRef = viewChild.required<ElementRef>('content');
  feedbackPopoverRef = viewChild.required<TemplateRef<any>>('feedback');

  html = this.#sanitizer.bypassSecurityTrustHtml(HTML);
  componentRefs = signal<any[]>([]);

  #init = afterNextRender(() => {
    const buttons = this.contentRef().nativeElement.querySelectorAll('button');
    buttons.forEach((button: HTMLButtonElement) => {
      const content = Array.from(button.childNodes);
      const ref = createComponent(DynamicButton, {
        environmentInjector: this.#appRef.injector,
        hostElement: button,
        projectableNodes: [content],
        directives: [
          {
            type: Popover,
            bindings: [
              inputBinding('axPopover', () => this.feedbackPopoverRef()),
              inputBinding('axPopoverContext', () => ({
                content: content[0].textContent,
              })),
              outputBinding('closed', () => {
                console.log('Closed');
              }),
            ],
          },
        ],
      });

      this.componentRefs.update((refs) => [...refs, ref]);
      this.#appRef.attachView(ref.hostView);
    });
  });

  #destroy = inject(DestroyRef).onDestroy(() =>
    this.componentRefs().forEach((ref) => {
      this.#appRef.detachView(ref.hostView);
      ref.destroy();
    }),
  );
}

@Component({
  template: `<ng-content />`,
})
export class DynamicButton {}

export const HTML = `
    <h3>This is a title from HTML string</h3>
    <p>This content is rendered using <code>[innerHTML]</code> binding.</p>
    <ul>
      <li>Item one</li>
      <li>Item two</li>
      <li>Item three</li>
    </ul>
    <button type="button">Confirm</button>
    <button type="button">Decline</button>
  `;
