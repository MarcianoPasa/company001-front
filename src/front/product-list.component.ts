import { Component, inject } from '@angular/core';
import { ProductService } from '../service/product.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from "@angular/router";
import { BehaviorSubject, combineLatest, map, Observable, switchMap, tap} from 'rxjs';
import { ProductPaginatorIntl } from './product-paginator-intl-0001';
import { MatPaginatorIntl, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { Product } from '../model/product.model';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterLink, MatPaginatorModule],
  templateUrl: './product-list.component.html',
  providers: [
    { provide: MatPaginatorIntl, useClass: ProductPaginatorIntl }
  ]
})
export class ProductListComponent {

  private readonly service = inject(ProductService);
  private readonly refresh$ = new BehaviorSubject<void>(undefined);
  private readonly pageState$ = new BehaviorSubject<{ index: number, size: number, totalElements: number }>({ index: 0, size: 5, totalElements: 0 });

  totalElements = 0;
  pageSize = 5;

  loading = false;

  readonly products$: Observable<Product[]> = combineLatest([
      this.refresh$,
      this.pageState$
    ]).pipe(
      tap(() => this.loading = true), // Começa o loading
      switchMap(([_, page]) => this.service.list(page.index, page.size)),
      tap((res: any) => {
        this.totalElements = res.totalElements === undefined ? res.length : res.totalElements;
        this.loading = false;
      }),
      map((res: any) => res.content ? res.content : res)
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

  handlePageEvent(e: PageEvent) {
    this.pageState$.next({ index: e.pageIndex, size: e.pageSize, totalElements: this.totalElements });
  }
}
