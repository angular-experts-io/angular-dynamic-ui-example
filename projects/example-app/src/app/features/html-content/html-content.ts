import { Component, ElementRef, viewChild } from '@angular/core';

@Component({
  selector: 'ax-html-content',
  imports: [],
  template: `
    <div class="flow-y-lg">
      <h2>HTML content</h2>

      
      <div #content [innerHTML]="html"></div>
    </div>
  `,
  styles: ``,
})
export class HtmlContent {
  contentRef = viewChild.required<ElementRef>('content');

  html = `
    <h3>This is a title from HTML string</h3>
    <p>This content is rendered using <code>[innerHTML]</code> binding.</p>
    <ul>
      <li>Item one</li>
      <li>Item two</li>
      <li>Item three</li>
    </ul>
    <button type="button">Confirm</button>
  `;
}
