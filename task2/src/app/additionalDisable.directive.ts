import { Directive, HostBinding, HostListener, Input } from '@angular/core';
import { MatTooltip } from '@angular/material/tooltip';

@Directive({
  selector: '[appAdditionalDisable]',
  standalone: true,
  providers: [MatTooltip],
})
export class AdditionalDisableDirective {
  @Input() isViewerDisabled!: boolean;
  @Input() viewerTooltip!: string;

  constructor(private readonly _tooltip: MatTooltip) {}

  @HostBinding('disabled')
  get isDisabled(): boolean {
    return this.isViewerDisabled;
  }

  @HostListener('mouseenter') onMouseEnter(): void {
    if (this.isViewerDisabled) {
      this._tooltip.message = this.viewerTooltip;
      this._tooltip.show();
    }
  }

  @HostListener('mouseleave') onMouseLeave(): void {
    if (this.isViewerDisabled) {
      this._tooltip.hide();
    }
  }

  @HostBinding('style.cursor')
  get cursorStyle(): string {
    return this.isViewerDisabled ? 'not-allowed' : '';
  }

  @HostBinding('style.pointerEvents')
  get pointerEvents(): string {
    return this.isViewerDisabled ? 'all' : '';
  }
}
