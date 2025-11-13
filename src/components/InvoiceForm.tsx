import { InvoiceData, InvoiceItem } from "@/lib/type";
import { FileDown, Printer, Trash2 } from "lucide-react";

interface InvoiceFormProps {
  invoiceData: InvoiceData;
  updateInvoiceData: (field: keyof InvoiceData, value: any) => void;
  updateItem: (index: number, field: keyof InvoiceItem, value: any) => void;
  addItem: () => void;
  removeItem: (index: number) => void;
  calculateTotals: () => { totalHT: number; tva: number; totalTTC: number };
  setShowPreview: (show: boolean) => void;
  showPreview: boolean;
  onPrint: () => void;
  onExportPDF: (fileName: string) => void;  
}

export default function InvoiceForm({
  invoiceData,
  updateInvoiceData,
  updateItem,
  addItem,
  removeItem,
  calculateTotals,
  setShowPreview,
  showPreview,
  onPrint,
  onExportPDF
}: InvoiceFormProps) {
  const { totalHT, tva, totalTTC } = calculateTotals();

  const handlePriceChange = (index: number, value: string) => {
    // Convertir la virgule en point pour le calcul
    const numericValue = parseFloat(value.replace(',', '.')) || 0;
    updateItem(index, 'unitPrice', numericValue);
  };

  const formatPriceForDisplay = (price: number): string => {
    return price === 0 ? '' : price.toString().replace('.', ',');
  };

   const handleDownloadPDF = () => {
    const fileName = `facture-${invoiceData.invoiceNumber || 'sans-numero'}`;
    onExportPDF(fileName);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Informations de la facture</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <h3 className="font-medium mb-2">Votre société</h3>
          <div className="space-y-2 p-3 bg-gray-50 rounded-lg">
            <p className="font-semibold">{invoiceData.companyName}</p>
            <p className="text-sm">{invoiceData.companyAddress}</p>
            <p className="text-sm">Tél: {invoiceData.companyPhone}</p>
          </div>
        </div>
        
        <div>
          <h3 className="font-medium mb-2">Client</h3>
          <div className="space-y-2">
            <input
              type="text"
              placeholder="Nom du client"
              className="w-full p-2 border rounded"
              value={invoiceData.clientName}
              onChange={(e) => updateInvoiceData('clientName', e.target.value)}
            />
            <input
              type="text"
              placeholder="Adresse"
              className="w-full p-2 border rounded"
              value={invoiceData.clientAddress}
              onChange={(e) => updateInvoiceData('clientAddress', e.target.value)}
            />
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Téléphone"
                className="w-full p-2 border rounded"
                value={invoiceData.clientPostalCode}
                onChange={(e) => updateInvoiceData('clientPostalCode', e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-1">N° de facture</label>
          <input
            type="text"
            placeholder="FACTURE N°"
            className="w-full p-2 border rounded"
            value={invoiceData.invoiceNumber}
            onChange={(e) => updateInvoiceData('invoiceNumber', e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Date de facture</label>
          <input
            type="date"
            className="w-full p-2 border rounded"
            value={invoiceData.invoiceDate}
            onChange={(e) => updateInvoiceData('invoiceDate', e.target.value)}
          />
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="font-medium mb-2">Prestations</h3>
        <div className="space-y-4">
          {invoiceData.items.map((item, index) => (
            <div key={index} className="flex gap-2 items-start">
              <input
                type="number"
                placeholder="Qté"
                className="w-12 md:w-16 p-2 border rounded"
                value={item.quantity}
                onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 0)}
                min="1"
              />
              <input
                type="text"
                placeholder="Désignation"
                className="flex-1 p-2 border rounded w-28 md:w-full"
                value={item.description}
                onChange={(e) => updateItem(index, 'description', e.target.value)}
              />
              <input
                type="text"
                placeholder="Prix unitaire HT"
                className="w-14 md:w-32 p-2 border rounded"
                value={formatPriceForDisplay(item.unitPrice)}
                onChange={(e) => handlePriceChange(index, e.target.value)}
              />
              {invoiceData.items.length > 1 && (
                <button
                  type="button"
                  className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
                  onClick={() => removeItem(index)}
                >
                  <Trash2 />
                </button>
              )}
            </div>
          ))}
        </div>
  
      </div>
      
      <div className="flex justify-between items-center pt-4 border-t">
         <button
            type="button"
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 font-medium flex items-center gap-2"
            onClick={handleDownloadPDF}
          >
           <FileDown />
            Télécharger PDF
          </button>
        <button
          type="button"
          className="bg-green-500 text-white px-6 py-2 gap-2 flex items-center rounded hover:bg-green-600 font-medium"
          onClick={onPrint}
        >
          <Printer />
          Imprimer la facture
        </button>
      </div>
    </div>
  );
}