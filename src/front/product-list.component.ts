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
  private readonly savedState = this.service.getPagination();

  totalElements = 0;
  pageSize = 5;
  loading = false;

  readonly pageState$ = new BehaviorSubject<{ index: number, size: number, totalElements: number }>({
    index: this.savedState.index,
    size: this.savedState.size,
    totalElements: 0
  });

  readonly products$: Observable<Product[]> = combineLatest([
    this.refresh$,
    this.pageState$
  ]).pipe(
      tap(() => this.loading = true),
      switchMap(([_, page]) => this.service.list(page.index, page.size)),
      tap((res: any) => {
        this.totalElements = res.page?.totalElements ?? 0;
        this.loading = false;
      }),
      map((res: any) => {
        return res._embedded?.productModelList ?? [];
      })
  );

  // readonly products$: Observable<Product[]> = combineLatest([
  //   this.refresh$,
  //   this.pageState$
  // ]).pipe(
  //   tap(() => this.loading = true),

  //   switchMap(([_, page]) =>
  //     this.service.list(page.index, page.size)
  //   ),

  //   tap((res: any) => {
  //     this.totalElements = res.page?.totalElements ?? 0;
  //     this.loading = false;
  //   }),

  //   map((res: any) =>
  //     res._embedded?.productModelList ?? []
  //   )
  // );

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
    this.service.setPagination(e.pageIndex, e.pageSize);
    this.pageState$.next({
      index: e.pageIndex,
      size: e.pageSize,
      totalElements: this.totalElements
    });
  }
}
