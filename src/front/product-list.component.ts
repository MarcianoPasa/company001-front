import { Component, inject, Injectable } from '@angular/core';
import { ProductService } from '../service/product.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from "@angular/router";
import { BehaviorSubject, Subject, switchMap } from 'rxjs';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-list.component.html'
})
export class ProductListComponent {

  private readonly service = inject(ProductService);
  private readonly refresh$ = new BehaviorSubject<void>(undefined);

  changes = new Subject<void>();
  firstPageLabel = $localize`Primeira página`;
  itemsPerPageLabel = $localize`Total de itens por página:`;
  lastPageLabel = $localize`Última página`;
  nextPageLabel = 'Próxima página';
  previousPageLabel = 'Página anterior';

  readonly products$ = this.refresh$.pipe(
    switchMap(() => this.service.list())
  );

  deleteProduct(id: string): void {
    if (confirm('Tem certeza?')) {
      this.service.delete(id).subscribe({
        next: () => {
          this.refresh$.next();
        }
      });
    }
  }

  copyToClipboard(id: string): void {
    navigator.clipboard.writeText(id).then(() => {
      console.log('ID copiado para a área de transferência!');
    }).catch(err => {
      console.error('Erro ao copiar ID:', err);
    });
  }

  getRangeLabel(page: number, pageSize: number, length: number): string {
    if (length === 0) {
      return $localize`Page 1 of 1`;
    }
    const amountPages = Math.ceil(length / pageSize);
    return $localize`Page ${page + 1} of ${amountPages}`;
  }
}
