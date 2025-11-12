export interface InvoiceData {
  companyName: string;
  companyAddress: string;
  companyPostalCode: string;
  companyCity: string;
  companySIRET: string;
  companyPhone: string;
  
  clientName: string;
  clientAddress: string;
  clientPostalCode: string;
  clientCity: string;
  
  invoiceNumber: string;
  invoiceDate: string;
  deliveryDate: string;
  paymentDueDate: string;
  
  items: InvoiceItem[];
  
  additionalInfo: string;
}

export interface InvoiceItem {
  quantity: number;
  description: string;
  unitPrice: number;
}