import { Component, inject, LOCALE_ID, OnInit } from '@angular/core';
import { CommonModule, formatNumber, Location } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../service/product.service';
import { Product } from '../model/product.model';
import { Observable, tap } from 'rxjs';
import { NotificationService } from '../app/shared/snack-bar.component';

@Component({
  selector: 'app-product-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-edit.component.html'
})
export class ProductEditComponent implements OnInit {

  id: string = '';
  product$!: Observable<Product>;
  productForm!: FormGroup;

  private readonly notification = inject(NotificationService);
  private readonly locale = inject(LOCALE_ID);
  private readonly location = inject(Location);

  constructor(
    private readonly route: ActivatedRoute,
    private readonly service: ProductService,
    private readonly router: Router,
    private readonly fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.productForm = this.fb.group({
      idProduct: [{ value: '', disabled: true }],
      name: ['', Validators.required],
      valueFormatted: ['', Validators.required]
    });

    this.id = this.route.snapshot.params['id'];

    if (this.id) {
      this.product$ = this.service.getById(this.id).pipe(
        tap(product => this.productForm.patchValue({
          ...product,
          valueFormatted: formatNumber(product.value, this.locale, '1.2-2')
        }))
      );
    }
  }

  saveProduct(): void {
    if (this.productForm.valid) {
      const formValue = this.productForm.getRawValue();
      const rawValue = formValue.valueFormatted.replaceAll('.', '').replaceAll(',', '.');

      const product: Product = {
        ...formValue,
        value: Number.parseFloat(rawValue) || 0
      };

      this.service.update(this.id, product).subscribe(() => {
        this.router.navigate(['/products']);
        this.notification.showMessage('Produto salvo com sucesso', 'snack-success');
      });
    }
  }

  goBack(): void {
    this.location.back();
  }

  copyToClipboard(): void {
    const id = this.productForm.getRawValue().idProduct;
    if (id) {
      navigator.clipboard.writeText(id).then(() => {
        console.log('ID copiado!');
      }).catch(err => {
        console.error('Erro ao copiar ID:', err);
      });
    }
  }
}
