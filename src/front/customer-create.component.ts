import { Component, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CustomerService } from '../service/customer.service';
import { Customer } from '../model/customer.model';
import { CnpjPipe } from '../app/shared/cnpj.pipe';
import { CnpjMaskDirective } from '../app/shared/cnpj-mask.directive';
import { NotificationService } from '../app/shared/snack-bar.component';

@Component({
  selector: 'app-customer-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CnpjMaskDirective],
  providers: [CnpjPipe],
  templateUrl: './customer-create.component.html'
})
export class CustomerCreateComponent {

  private readonly notification = inject(NotificationService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly service = inject(CustomerService);
  private readonly router = inject(Router);
  private readonly location = inject(Location);

  customerForm: FormGroup = this.formBuilder.group({
    businessName: ['', [Validators.required, Validators.minLength(3)]],
    corporateName: ['', [Validators.required, Validators.minLength(3)]],
    businessTaxId: ['', [Validators.required]]
  });

  saveCustomer(): void {
    if (this.customerForm.valid) {
      const formValue = this.customerForm.getRawValue();
      const taxIdRaw = (formValue.businessTaxId || '').replace(/\D/g, '');
      const valueStr = formValue.valueFormatted || '0';
      const rawValue = valueStr.replaceAll('.', '').replaceAll(',', '.');

      const customer: Customer = {
        ...formValue,
        businessTaxId: taxIdRaw,
        value: Number.parseFloat(rawValue) || 0
      };

      this.service.create(customer).subscribe({
        next: () => {
          this.router.navigate(['/customers']);
          console.error('Cliente criado com sucesso');
          this.notification.showMessage('Cliente salvo com sucesso', 'snack-success');
        },
        error: (err) => {
          console.error('Erro ao salvar o cliente:', err);
          this.notification.showMessage('Erro ao salvar o cliente', 'snack-error');
        }
      });
    }
  }

  goBack(): void {
    this.location.back();
  }
}
