import { Component, inject } from '@angular/core';
import { ProductService } from '../service/product.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from "@angular/router";
import { BehaviorSubject, combineLatest, map, Observable, switchMap, tap} from 'rxjs';
import { ProductPaginatorIntl } from './product-paginator-intl-0001';
import { MatPaginatorIntl, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { Product } from '../model/product.model';
import { NotificationService } from '../app/shared/services/notification.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from './confirm-dialog.component';
import { ClipboardService } from '../app/shared/services/clipboard.service';

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

  private readonly notification = inject(NotificationService);
  private readonly service = inject(ProductService);
  private readonly refresh$ = new BehaviorSubject<void>(undefined);
  private readonly savedState = this.service.getPagination();
  private readonly dialog = inject(MatDialog);
  private readonly clipboardService = inject(ClipboardService);

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

  deleteProduct(product: Product): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '450px',
      data: { name: product.name, who: 'o produto' },
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.service.delete(product.idProduct).subscribe({
          next: () => {
            this.refresh$.next();
            this.notification.showMessage('Produto excluído com sucesso', 'snack-success');
          },
          error: (err) => {
            console.error('Erro ao excluir produto', err);
            this.notification.showMessage('Erro ao excluir produto', 'snack-error');
          }
        });
      }
    });
  }

  copyToClipboard(id: string): void {
    this.clipboardService.copyToClipboard(id);
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
