import { Component, inject, LOCALE_ID, OnInit } from '@angular/core';
import { CommonModule, formatNumber, Location } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerService } from '../service/customer.service';
import { Customer } from '../model/customer.model';
import { Observable, tap } from 'rxjs';
import { CnpjMaskDirective } from '../app/shared/cnpj-mask.directive';
import { CnpjPipe } from '../app/shared/cnpj.pipe';
import { NotificationService } from '../app/shared/snack-bar.component';

@Component({
  selector: 'app-customer-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CnpjMaskDirective],
  providers: [CnpjPipe],
  templateUrl: './customer-edit.component.html'
})
export class CustomerEditComponent implements OnInit {

  id: string = '';
  customer$!: Observable<Customer>;
  customerForm!: FormGroup;

  private readonly notification = inject(NotificationService);
  private readonly locale = inject(LOCALE_ID);
  private readonly location = inject(Location);
  private readonly cnpjPipe = inject(CnpjPipe);

  constructor(
    private readonly route: ActivatedRoute,
    private readonly service: CustomerService,
    private readonly router: Router,
    private readonly formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.customerForm = this.formBuilder.group({
      idCustomer: [{ value: '', disabled: true }],
      businessName: ['', Validators.required],
      corporateName: ['', Validators.required],
      businessTaxId: ['', Validators.required]
    });

    this.id = this.route.snapshot.params['id'];

    if (this.id) {
      this.customer$ = this.service.getById(this.id).pipe(
        tap(customer => this.customerForm.patchValue({
          ...customer,
          idCustomer: customer.idCustomer,
          businessTaxId: this.cnpjPipe.transform(customer.businessTaxId),
          valueFormatted: formatNumber(customer.value, this.locale, '1.2-2')
        }))
      );
    }
  }

  saveCustomer(): void {
    if (this.customerForm.valid) {
      const formValue = this.customerForm.getRawValue();
      const taxIdRaw = (formValue.businessTaxId || '').replaceAll(/\D/g, '');
      const valueStr = formValue.valueFormatted || '0';
      const rawValue = valueStr.replaceAll('.', '').replaceAll(',', '.');

      const customer: Customer = {
        ...formValue,
        businessTaxId: taxIdRaw,
        value: Number.parseFloat(rawValue) || 0
      };

      this.service.update(this.id, customer).subscribe({
        next: () => {
          this.router.navigate(['/customers']);
          this.notification.showMessage('Cliente atualizado com sucesso', 'snack-success');
        },
        error: (err) => {
          console.error('Erro ao atualizar o cliente:', err);
          this.notification.showMessage('Erro ao atualizar o cliente. Verifique o console.', 'snack-error ');
        }
      });
    }
  }

  goBack(): void {
    this.location.back();
  }

  copyToClipboard(): void {
    const id = this.customerForm.getRawValue().idCustomer;
    if (id) {
      navigator.clipboard.writeText(id).then(() => {
        console.log('ID copiado para a área de transferência');
        this.notification.showMessage('ID copiado para a área de transferência', 'snack-success');
      }).catch(err => {
        console.error('Erro ao copiar ID:', err);
        this.notification.showMessage('Erro ao copiar ID', 'snack-error');
      });
    }
  }
}
