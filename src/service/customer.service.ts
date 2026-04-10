
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Customer } from '../model/customer.model';
import { Observable } from 'rxjs';
import { CustomerPage } from '../model/customer-page.model';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  private readonly http = inject(HttpClient);
  private readonly API = 'http://localhost:8080/customers';
  private paginationState = { index: 0, size: 5 };

  setPagination(index: number, size: number) {
    this.paginationState = { index, size };
  }

  getPagination() {
    return this.paginationState;
  }

  list(page: number = 0, size: number = 5): Observable<CustomerPage> {
    return this.http.get<CustomerPage>(`${this.API}?page=${page}&size=${size}`);
  }

  getById(id: string): Observable<Customer> {
    return this.http.get<Customer>(`${this.API}/${id}`);
  }

  create(customer: Customer): Observable<Customer> {
    return this.http.post<Customer>(this.API, customer);
  }

  update(id: string, customer: Customer): Observable<Customer> {
    return this.http.put<Customer>(`${this.API}/${id}`, customer);
  }

  delete(id: string): Observable<string> {
    return this.http.delete(`${this.API}/${id}`, { responseType: 'text' });
  }
}

