export interface Product {
  idProduct: string;
  name: string;
  value: number;
  _links?: {
    self?: {
      href: string;
    }
  };
}


