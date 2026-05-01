import { Component, inject } from '@angular/core';
import { CustomerService } from '../service/customer.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from "@angular/router";
import { BehaviorSubject, combineLatest, map, Observable, switchMap, tap} from 'rxjs';
import { CustomerPaginatorIntl } from './customer-paginator-intl-0001';
import { MatPaginatorIntl, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { Customer } from '../model/customer.model';
import { CnpjPipe } from '../app/shared/pipes/cnpj.pipe';
import { NotificationService } from '../app/shared/services/notification.service';
import { ConfirmDialogComponent } from './confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ClipboardService } from '../app/shared/services/clipboard.service';

@Component({
  selector: 'app-customer-list',
  standalone: true,
  imports: [CommonModule, RouterLink, MatPaginatorModule, CnpjPipe ],
  templateUrl: './customer-list.component.html',
  providers: [
    { provide: MatPaginatorIntl, useClass: CustomerPaginatorIntl }
  ]
})
export class CustomerListComponent {

  private readonly notification = inject(NotificationService);
  private readonly service = inject(CustomerService);
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

  readonly customers$: Observable<Customer[]> = combineLatest([
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
        return res._embedded?.customerModelList ?? [];
      })
  );

  deleteCustomer(customer: Customer): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '450px',
      data: { name: customer.businessName, who: 'o cliente' },
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.service.delete(customer.idCustomer).subscribe({
          next: () => {
            this.refresh$.next();
            this.notification.showMessage('Cliente excluído com sucesso', 'snack-success');
          },
          error: (err) => {
            console.error('Erro ao excluir cliente', err);
            this.notification.showMessage('Erro ao excluir cliente.', 'snack-error')
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
