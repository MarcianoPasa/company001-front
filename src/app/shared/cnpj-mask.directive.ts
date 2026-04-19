import { Directive, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appCnpjMask]',
  standalone: true
})
export class CnpjMaskDirective {
  constructor(private ngControl: NgControl) {}

  @HostListener('input', ['$event'])
  onInput(event: any) {
    const input = event.target;
    let value = input.value.replace(/\D/g, '');

    if (value.length > 14) {
      value = value.substring(0, 14);
    }

    let formatted = '';
    if (value.length > 0) {
      formatted = value;
      if (value.length > 2) {
        formatted = value.substring(0, 2) + '.' + value.substring(2);
      }
      if (value.length > 5) {
        formatted = formatted.substring(0, 6) + '.' + value.substring(5);
      }
      if (value.length > 8) {
        formatted = formatted.substring(0, 10) + '/' + value.substring(8);
      }
      if (value.length > 12) {
        formatted = formatted.substring(0, 15) + '-' + value.substring(12);
      }
    }

    this.ngControl.control?.setValue(formatted, { emitEvent: false });
  }

  @HostListener('blur')
  onBlur() {
    const value = this.ngControl.control?.value;
    if (value && value.length !== 18) {
    }
  }
}
