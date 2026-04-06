import { Routes } from '@angular/router';
import { ProductListComponent } from '../front/product-list.component';
import { ProductEditComponent } from '../front/product-edit.component';
import { ProductCreateComponent } from '../front/product-create.component';

export const routes: Routes = [

  { path: 'products', component: ProductListComponent },

  { path: 'products/edit/:id', component: ProductEditComponent },

  { path: 'products/new', component: ProductCreateComponent },

  // Se a URL estiver vazia, vá para /produtos
  { path: '', redirectTo: 'products', pathMatch: 'full' },

  // Rota de "página não encontrada" (opcional)
  { path: '**', redirectTo: 'products' }

];
