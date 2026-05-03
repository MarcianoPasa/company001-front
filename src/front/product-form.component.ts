import { Component, ElementRef, inject, LOCALE_ID, OnInit, ViewChild } from '@angular/core';
import { CommonModule, formatNumber, Location } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../service/product.service';
import { Product } from '../model/product.model';
import { NotificationService } from '../app/shared/services/notification.service';
import { ClipboardService } from '../app/shared/services/clipboard.service';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-form.component.html'
})
export class ProductFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly service = inject(ProductService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly location = inject(Location);
  private readonly locale = inject(LOCALE_ID);
  private readonly notification = inject(NotificationService);
  private readonly clipboard = inject(ClipboardService);
  private _nameInput?: ElementRef<HTMLInputElement>;

  productForm!: FormGroup;
  isEditMode = false;
  loading = false;
  saving = false;
  idProduct: string | null = null;

  @ViewChild('nameInput') set nameInput(element: ElementRef<HTMLInputElement>) {
    if (element) {
      this._nameInput = element;
      setTimeout(() => {
        this._nameInput?.nativeElement.focus();
      }, 50);
    }
  }

  ngOnInit(): void {
    this.initForm();
    this.checkEditMode();
  }

  private initForm(): void {
    this.productForm = this.fb.group({
      idProduct: [{ value: '', disabled: true }],
      name: ['', [Validators.required, Validators.minLength(3)]],
      valueFormatted: ['', Validators.required]
    });
  }

  private checkEditMode(): void {
    this.idProduct = this.route.snapshot.paramMap.get('id');
    if (this.idProduct) {
      this.isEditMode = true;
      this.loadProduct();
    }
  }

  private loadProduct(): void {
    this.loading = true;
    this.service.getById(this.idProduct!).subscribe({
      next: (product) => {
        this.productForm.patchValue({
          ...product,
          valueFormatted: formatNumber(product.value, this.locale, '1.2-2')
        });
      },
      error: () => {
        this.loading = false;
        this.notification.showMessage('error ao carregar produto', 'snack-error');
        this.goBack();
      }
    });
    this.loading = false;
  }

  saveProduct(): void {
    if (this.productForm.invalid) {
      return;
    }

    this.saving = true;
    const formValue = this.productForm.getRawValue();
    const rawValue = formValue.valueFormatted.replaceAll('.', '').replaceAll(',', '.');

    const productData: Product = {
      ...formValue,
      value: Number.parseFloat(rawValue) || 0
    };

    const request$ = this.isEditMode
      ? this.service.update(this.idProduct!, productData)
      : this.service.create(productData);

    request$.subscribe({
      next: () => {
        this.notification.showMessage(
          `Produto ${this.isEditMode ? 'atualizado' : 'criado'} com sucesso!`,
          'snack-success'
        );
        this.router.navigate(['/products']);
      },
      error: (err) => {
        console.error(err);
        this.notification.showMessage('Erro ao salvar produto', 'snack-error');
        this.saving = false;
      }
    });
  }

  copyToClipboard(): void {
    const id = this.productForm.getRawValue().idProduct;
    if (id) {
      this.clipboard.copyToClipboard(id);
    }
  }

  goBack(): void {
    this.location.back();
  }
}
