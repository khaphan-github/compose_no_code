import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[ngxQueryParamKeyMap]'
})
export class QueryParamKeyMapDirective {
  constructor(private el: ElementRef) {}

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (event.key === '\\' && !event.shiftKey && !event.ctrlKey && !event.altKey && !event.metaKey) {
      event.preventDefault();

      const currentValue = (this.el.nativeElement as HTMLTextAreaElement).value;
      const generatedText = ` $${this.countCharacterOccurrences(currentValue) + 1}`;

      const cursorPosition = (this.el.nativeElement as HTMLTextAreaElement).selectionStart || 0;
      const textBeforeCursor = (this.el.nativeElement as HTMLTextAreaElement).value.substring(0, cursorPosition);
      const textAfterCursor = (this.el.nativeElement as HTMLTextAreaElement).value.substring(cursorPosition);

      (this.el.nativeElement as HTMLTextAreaElement).value = textBeforeCursor + generatedText + textAfterCursor;

      const newCursorPosition = cursorPosition + generatedText.length;
      (this.el.nativeElement as HTMLTextAreaElement).setSelectionRange(newCursorPosition, newCursorPosition);
    }
  }

  countCharacterOccurrences(text: string): number {
    return text.length - text.replaceAll('$', '').length;
  }
}
