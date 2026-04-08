
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from '../model/product.model';
import { Observable } from 'rxjs';
import { ProductPage } from '../model/product-page.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private readonly http = inject(HttpClient);
  private readonly API = 'http://localhost:8080/products';
  private paginationState = { index: 0, size: 5 };

  setPagination(index: number, size: number) {
    this.paginationState = { index, size };
  }

  getPagination() {
    return this.paginationState;
  }

  list(page: number = 0, size: number = 5): Observable<ProductPage> {
    return this.http.get<ProductPage>(`${this.API}?page=${page}&size=${size}`);
  }

  getById(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.API}/${id}`);
  }

  create(product: Product): Observable<Product> {
    return this.http.post<Product>(this.API, product);
  }

  update(id: string, product: Product): Observable<Product> {
    return this.http.put<Product>(`${this.API}/${id}`, product);
  }

  delete(id: string): Observable<string> {
    return this.http.delete(`${this.API}/${id}`, { responseType: 'text' });
  }
}

