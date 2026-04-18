import { Routes } from '@angular/router';
import { ProductListComponent } from '../front/product-list.component';
import { ProductEditComponent } from '../front/product-edit.component';
import { ProductCreateComponent } from '../front/product-create.component';
import { PrincipalComponent } from '../front/principal.component';
import { CustomerListComponent } from '../front/customer-list.component';
import { CustomerEditComponent } from '../front/customer-edit.component';

export const routes: Routes = [

  { path: 'pricipal', component: PrincipalComponent },

  { path: 'products', component: ProductListComponent },

  { path: 'products/edit/:id', component: ProductEditComponent },

  { path: 'products/new', component: ProductCreateComponent },

  { path: 'customers', component: CustomerListComponent },

  { path: 'customers/edit/:id', component: CustomerEditComponent },

  // { path: 'customer/new', component: CustomerCreateComponent },

  // Se a URL estiver vazia, vá para /produtos
  { path: '', redirectTo: 'pricipal', pathMatch: 'full' },

  // Rota de "página não encontrada" (opcional)
  { path: '**', redirectTo: 'pricipal' }

];
