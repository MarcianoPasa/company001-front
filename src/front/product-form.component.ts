import { ChangeDetectorRef, Component, ElementRef, inject, LOCALE_ID, OnInit, ViewChild } from '@angular/core';
import { CommonModule, formatNumber, Location } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../service/product.service';
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
  private readonly cdr = inject(ChangeDetectorRef);

  productForm!: FormGroup;
  isEditMode = false;
  loading = false;
  saving = false;
  idProduct: string | null = null;
  imagePreview: string | null = null;
  imageFullRes: string | null = null;

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
    const id = this.idProduct;
    if (!id) return;

    this.loading = true;
    this.service.getById(id).subscribe({
      next: (product) => {
        this.productForm.patchValue({
          ...product,
          valueFormatted: formatNumber(product.value, this.locale, '1.2-2')
        });

        if (product.image) {
          this.imageFullRes = 'data:image/png;base64,' + product.image;
        }

        if (product.thumbnail) {
          this.imagePreview = 'data:image/png;base64,' + product.thumbnail;
        } else {
          this.imagePreview = this.imageFullRes;
        }

        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.notification.showMessage('Erro ao carregar produto', 'snack-error');
        this.goBack();
      }
    });
  }

  saveProduct(): void {
    if (this.productForm.invalid) {
      return;
    }

    this.saving = true;
    this.cdr.detectChanges();

    const formValue = this.productForm.getRawValue();

    const rawValue = formValue.valueFormatted
      .replace(/\./g, '')
      .replace(',', '.');

    const productData: any = {
      name: formValue.name,
      value: Number.parseFloat(rawValue) || 0,
      image: this.imageFullRes?.includes(',')
            ? this.imageFullRes.split(',')[1]
            : null
    };

    const request$ = this.isEditMode
      ? this.service.update(this.idProduct!, productData)
      : this.service.create(productData);

    request$.subscribe({
      next: () => {
        this.notification.showMessage('Produto salvo com sucesso!', 'snack-success');
        this.router.navigate(['/products']);
      },
      error: (err) => {
        this.saving = false;
        this.cdr.detectChanges();
        console.error('Erro detalhado:', err);
        this.notification.showMessage('Erro ao salvar. Verifique o console.', 'snack-error');
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

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        this.imagePreview = result;
        this.imageFullRes = result;
        this.productForm.patchValue({ image: result });
        this.cdr.detectChanges();
        event.target.value = '';
      };
      reader.readAsDataURL(file);
    }
  }

  downloadImage(): void {
    const contentToDownload = this.imageFullRes || this.imagePreview;

    if (!contentToDownload) {
      return;
    }

    const link = document.createElement('a');
    const productName = this.productForm.get('name')?.value || 'produto';

    link.download = `foto-${productName.toLowerCase().replace(/\s+/g, '-')}.png`;
    link.href = contentToDownload;
    link.click();
    this.notification.showMessage('Download iniciado (Alta Resolução)!', 'snack-success');
  }

  removeImage(): void {
    this.imagePreview = null;
    this.imageFullRes = null;
    this.productForm.patchValue({ image: '' });
  }  
}
