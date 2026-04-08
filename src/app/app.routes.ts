import { Routes } from '@angular/router';
import { ProductListComponent } from '../front/product-list.component';
import { ProductEditComponent } from '../front/product-edit.component';
import { ProductCreateComponent } from '../front/product-create.component';
import { PrincipalComponent } from '../front/principal.component';

export const routes: Routes = [

  { path: 'pricipal', component: PrincipalComponent },

  { path: 'products', component: ProductListComponent },

  { path: 'products/edit/:id', component: ProductEditComponent },

  { path: 'products/new', component: ProductCreateComponent },

  // Se a URL estiver vazia, vá para /produtos
  { path: '', redirectTo: 'pricipal', pathMatch: 'full' },

  // Rota de "página não encontrada" (opcional)
  { path: '**', redirectTo: 'pricipal' }

];
