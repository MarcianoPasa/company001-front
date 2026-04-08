import { Component, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductService } from '../service/product.service';
import { Product } from '../model/product.model';

@Component({
  selector: 'app-product-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-create.component.html'
})
export class ProductCreateComponent {

  private readonly fb = inject(FormBuilder);
  private readonly service = inject(ProductService);
  private readonly router = inject(Router);
  private readonly location = inject(Location);
  
  productForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    valueFormatted: ['', Validators.required]
  });

  saveProduct(): void {
    if (this.productForm.valid) {
      const formValue = this.productForm.value;

      const rawValue = formValue.valueFormatted
        .replace('.', '')
        .replace(',', '.');

      const newProduct: Product = {
        idProduct: '',
        name: formValue.name,
        value: Number.parseFloat(rawValue) || 0
      };

      this.service.create(newProduct).subscribe({
        next: () => {
          this.router.navigate(['/products']);
        },
        error: (err) => {
          console.error('Erro ao criar produto:', err);
          alert('Erro ao salvar o produto. Verifique o console.');
        }
      });
    }
  }

  goBack(): void {
    this.location.back();
  }
}
