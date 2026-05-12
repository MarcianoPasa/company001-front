export interface Product {
  idProduct: string;
  name: string;
  value: number;
  image?: string;
  thumbnail?: string;
  _links?: {
    self?: {
      href: string;
    };
    [key: string]: any;
  };
}

export interface ProductList {
  idProduct: string;
  name: string;
  value: number;
  thumbnail?: string;
  _links?: {
    self?: {
      href: string;
    }
  };
}

export interface ProductPage {
  _embedded?: {
    [key: string]: ProductList[];
  };
  page: {
    size: number;
    totalElements: number;
    totalPages: number;
    number: number;
  };
}
