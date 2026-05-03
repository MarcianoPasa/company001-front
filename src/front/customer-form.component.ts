import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerService } from '../service/customer.service';
import { Customer } from '../model/customer.model';
import { CnpjPipe } from '../app/shared/pipes/cnpj.pipe';
import { CnpjMaskDirective } from '../app/shared/directives/cnpj-mask.directive';
import { NotificationService } from '../app/shared/services/notification.service';
import { ClipboardService } from '../app/shared/services/clipboard.service';

@Component({
  selector: 'app-customer-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CnpjMaskDirective],
  providers: [CnpjPipe],
  templateUrl: './customer-form.component.html'
})
export class CustomerFormComponent implements OnInit {

  private readonly fb = inject(FormBuilder);
  private readonly service = inject(CustomerService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly location = inject(Location);
  private readonly notification = inject(NotificationService);
  private readonly clipboard = inject(ClipboardService);
  private readonly cnpjPipe = inject(CnpjPipe);
  private _nameInput?: ElementRef<HTMLInputElement>;

  customerForm!: FormGroup;
  isEditMode = false;
  loading = false;
  saving = false;
  idCustomer: string | null = null;

  @ViewChild('nameInput') set nameInput(element: ElementRef<HTMLInputElement>) {
    if (element) {
      this._nameInput = element;
      setTimeout(() => this._nameInput?.nativeElement.focus(), 50);
    }
  }

  ngOnInit(): void {
    this.initForm();
    this.checkEditMode();
  }

  private initForm(): void {
    this.customerForm = this.fb.group({
      idCustomer: [{ value: '', disabled: true }],
      businessName: ['', [Validators.required, Validators.minLength(3)]],
      corporateName: ['', [Validators.required, Validators.minLength(3)]],
      businessTaxId: ['', [Validators.required]]
    });
  }

  private checkEditMode(): void {
    this.idCustomer = this.route.snapshot.paramMap.get('id');
    if (this.idCustomer) {
      this.isEditMode = true;
      this.loadCustomer();
    }
  }

  private loadCustomer(): void {
    this.loading = true;
    this.service.getById(this.idCustomer!).subscribe({
      next: (customer) => {
        this.customerForm.patchValue({
          ...customer,
          businessTaxId: this.cnpjPipe.transform(customer.businessTaxId)
        });
      },
      error: () => {
        this.loading = false;
        this.notification.showMessage('Erro ao carregar cliente', 'snack-error');
        this.goBack();
      }
    });
    this.loading = false;
  }

  saveCustomer(): void {
    if (this.customerForm.invalid) {
       return;
    }

    this.saving = true;
    const formValue = this.customerForm.getRawValue();
    const taxIdRaw = (formValue.businessTaxId || '').replaceAll(/\D/g, '');

    const customerData: Customer = {
      ...formValue,
      businessTaxId: taxIdRaw
    };

    const request$ = this.isEditMode
      ? this.service.update(this.idCustomer!, customerData)
      : this.service.create(customerData);

    request$.subscribe({
      next: () => {
        this.notification.showMessage(
          `Cliente ${this.isEditMode ? 'atualizado' : 'criado'} com sucesso!`,
          'snack-success'
        );
        this.router.navigate(['/customers']);
      },
      error: (err) => {
        console.error(err);
        this.notification.showMessage('Erro ao salvar cliente', 'snack-error');
        this.saving = false;
      }
    });
  }

  copyToClipboard(): void {
    const id = this.customerForm.getRawValue().idCustomer;
    if (id) this.clipboard.copyToClipboard(id);
  }

  goBack(): void {
    this.location.back();
  }
}
