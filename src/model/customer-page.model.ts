import { Customer } from "./customer.model";

export interface CustomerPage {
  content: Customer[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}
