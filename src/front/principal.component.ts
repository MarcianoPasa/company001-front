import { Component, inject } from '@angular/core';
import { ProductService } from '../service/product.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from "@angular/router";
import { BehaviorSubject, switchMap } from 'rxjs';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './principal.component.html',
  styleUrl: './principal.component.css'
})
export class PrincipalComponent {

}
