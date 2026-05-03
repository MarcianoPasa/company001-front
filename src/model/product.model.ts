export interface Product {
  idProduct: string;
  name: string;
  value: number;
  image?: string;
  _links?: {
    self?: {
      href: string;
    }
  };
}


