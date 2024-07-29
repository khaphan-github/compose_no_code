import { Directive, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appCopyToClipboard]',
  standalone: true
})
export class CopyToClipboardDirective {

  @Input('appCopyToClipboard') textToCopy!: string;

  constructor() { }

  @HostListener('click') onClick() {
    this.copyToClipboard(this.textToCopy);
  }

  private copyToClipboard(text: string) {
    const el = document.createElement('textarea');
    el.value = text;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  }
}
