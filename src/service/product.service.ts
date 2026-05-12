
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product, ProductPage } from '../model/product.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private readonly http = inject(HttpClient);
  private readonly API = 'http://localhost:8081/products';
  private paginationState = { index: 0, size: 5 };

  setPagination(index: number, size: number) {
    this.paginationState = { index, size };
  }

  getPagination() {
    return this.paginationState;
  }

  list(page: number = 0, size: number = 5): Observable<ProductPage> {
    const url = `${this.API}?page=${page}&size=${size}`;
    return this.http.get<ProductPage>(url);
  }

  getById(id: string): Observable<Product> {
    const url = `${this.API}/${id}`;
    return this.http.get<Product>(url);
  }

  create(product: Product): Observable<Product> {
    return this.http.post<Product>(this.API, product);
  }

  update(id: string, product: any): Observable<Product> { 
    const url = `${this.API}/${id}`;
    return this.http.put<Product>(url, product);
  }

  delete(id: string): Observable<string> {
    const url = `${this.API}/${id}`;
    return this.http.delete(url, { responseType: 'text' });
  }
}

