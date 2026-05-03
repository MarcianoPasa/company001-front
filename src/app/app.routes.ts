import { Routes } from '@angular/router';
import { ProductListComponent } from '../front/product-list.component';
import { PrincipalComponent } from '../front/principal.component';
import { CustomerListComponent } from '../front/customer-list.component';
import { ProductFormComponent } from '../front/product-form.component';
import { PageNotFoundComponent } from '../front/page-not-found.component';
import { CustomerFormComponent } from '../front/customer-form.component';

export const routes: Routes = [

  { path: 'products', component: ProductListComponent },
  { path: 'products/new', component: ProductFormComponent },
  { path: 'products/edit/:id', component: ProductFormComponent },

  { path: 'customers', component: CustomerListComponent },
  { path: 'customers/new', component: CustomerFormComponent },
  { path: 'customers/edit/:id', component: CustomerFormComponent },

  { path: 'principal', component: PrincipalComponent },

  // If the URL is empty, redirect to "/principal"
  { path: '', redirectTo: 'principal', pathMatch: 'full' },

  // Route for "page not found"
  { path: '**', component: PageNotFoundComponent }

];
