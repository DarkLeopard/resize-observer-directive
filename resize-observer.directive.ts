import {
  Directive,
  ElementRef,
  EventEmitter,
  OnDestroy,
  Output,
}                     from '@angular/core';
import ResizeObserver from 'resize-observer-polyfill'; // https://www.npmjs.com/package/resize-observer-polyfill

const entriesMap = new WeakMap();

const ro = new ResizeObserver(entries => {
  for ( const entry of entries ) {
    if ( entriesMap.has(entry.target) ) {
      const comp = entriesMap.get(entry.target);
      comp._resizeCallback(entry);
    }
  }
});

@Directive({ selector: '[resizeObserver]' })
export class ResizeObserverDirective implements OnDestroy {

  @Output() resize: EventEmitter<any> = new EventEmitter();

  constructor(
      private el: ElementRef,
  ) {
    const target = this.el.nativeElement;
    entriesMap.set(target, this);
    ro.observe(target);
  }

  public _resizeCallback(entry) {
    this.resize.emit(entry);
  }

  public ngOnDestroy(): void {
    const target = this.el.nativeElement;
    ro.unobserve(target);
    entriesMap.delete(target);
  }
}
