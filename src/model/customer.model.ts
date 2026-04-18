export interface Customer {
  idCustomer: string;
  businessName: string;
  corporateName: string;
  businessTaxId: string;
  value: number;
  _links?: {
    self?: {
      href: string;
    }
  };
}
