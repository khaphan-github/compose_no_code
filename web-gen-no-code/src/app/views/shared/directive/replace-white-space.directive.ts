// replace-space.directive.ts

import { Directive, ElementRef, HostListener } from '@angular/core';
import { TextConverter } from '../helpers/text-converter.helper';

@Directive({
  standalone: true,
  selector: '[ngxReplaceSpace]',
})
export class ReplaceSpaceDirective {

  constructor(private el: ElementRef) { }

  @HostListener('input') onInput() {
    const inputValue = (this.el.nativeElement as HTMLInputElement).value;
    let newValue = TextConverter.replaceNonAlphabetic(inputValue, '_');
    newValue = TextConverter.replaceNumber(newValue);
    newValue = TextConverter.toNonAccentVietnamese(newValue);
    newValue = TextConverter.replaceWhiteSpace(newValue);
    (this.el.nativeElement as HTMLInputElement).value = newValue.toLowerCase();
  }
}
