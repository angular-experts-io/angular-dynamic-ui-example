import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';

@Component({
  selector: 'ax-card',
  template: `
    <div
      class="rounded-xl shadow-sm border h-full"
      [class.cursor-pointer]="clickable()"
      [class.hover:shadow-md]="clickable()"
      [class.bg-green-300]="success()"
      [class.bg-white]="!success()"
      [class.border-gray-300]="!active()"
      [class.border-2]="active()"
      [class.border-blue-500]="active()"
      [class.p-4]="!paddingless()"
    >
      <ng-content />
    </div>
  `,
  styles: `
    :host {
      @apply block rounded-xl;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Card {
  active = input(false, { transform: booleanAttribute });
  paddingless = input(false, { transform: booleanAttribute });
  clickable = input(false, { transform: booleanAttribute });
  success = input(false, { transform: booleanAttribute });

  closed = output<void>();
}
