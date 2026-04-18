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
    let value = event.target.value.replace(/\D/g, '');
    if (value.length > 14) value = value.substring(0, 14);

    const formatted = value.replace(
      /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
      '$1.$2.$3/$4-$5'
    ).replace(
      /^(\d{2})(\d{3})(\d{3})(\d{4})/, '$1.$2.$3/$4'
    ).replace(
      /^(\d{2})(\d{3})(\d{3})/, '$1.$2.$3'
    ).replace(
      /^(\d{2})(\d{3})/, '$1.$2'
    );

    this.ngControl.control?.setValue(formatted, { emitEvent: false });
  }
}

