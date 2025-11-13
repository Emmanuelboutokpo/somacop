import { InvoiceData } from "@/lib/type";
import { formatDate } from "@/lib/utils";
import { toPng } from "html-to-image";
import { QRCodeSVG } from 'qrcode.react';
import { forwardRef, useRef } from "react";
 
interface InvoicePreviewProps {
  invoiceData: InvoiceData;
  calculateTotals: () => { totalHT: number; tva: number; totalTTC: number };
}

const InvoicePreview = forwardRef<HTMLDivElement, InvoicePreviewProps>(
  ({ invoiceData, calculateTotals }, ref) => {
  const { totalHT} = calculateTotals();
    const validItems = invoiceData.items.filter(item => 
    !(item.quantity === 1 && item.description === '' && item.unitPrice === 0)
  );

   const calculateItemTotal = (quantity: number, unitPrice: number): number => {
    return quantity * unitPrice;
  };

  const generateQRData = () => {
    const qrData = {
      facture: invoiceData.invoiceNumber,
      date: invoiceData.invoiceDate,
      client: invoiceData.clientName,
      totalHT: totalHT,
      societe: invoiceData.companyName
    };
    
    return JSON.stringify(qrData, null, 2);
  };

  return (
      <div className="facture-container" ref={ref}>
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold">F A C T U R E  N° {invoiceData.invoiceNumber}</h1>
      </div>
        
        <div className="flex justify-between items-center">
          <div>
            <p className="font-semibold text-lg">{invoiceData.companyName}</p>
            <p className="text-sm">{invoiceData.companyAddress}</p>
            <p className="text-sm">{invoiceData.companyPhone}</p>
          </div>
          
          <div>
            <p className="font-semibold">Client : {invoiceData.clientName}</p>
            <p className="text-xs"> Adresse : {invoiceData.clientAddress}</p>
            <p className="text-xs"> Tél : {invoiceData.clientPostalCode} {invoiceData.clientCity}</p>
          </div>
        </div>
        
       <div className="mb-6 text-sm text-center my-4.5">
          <p><span className="font-semibold">Date de facture:</span> {formatDate(invoiceData.invoiceDate)}</p>
        </div>
        
        <div className="mb-6">
          <div className="grid grid-cols-12 gap-2 font-semibold border-b pb-2 mb-2">
            <div className="col-span-2 text-center">Quantité</div>
            <div className="col-span-5 text-center">Désignation</div>
            <div className="col-span-2 text-center">Prix unitaire</div>
            <div className="col-span-3 text-center">Montant total</div>
          </div>
          
          {validItems.map((item, index) =>{
            const itemTotal = calculateItemTotal(item.quantity, item.unitPrice);
            return(
              <div key={index} className="grid grid-cols-12 facture-wrapper  gap-2 py-1 border-b">
                <div className="col-span-2 text-center">{item.quantity}</div>
                <div className="col-span-5 text-center">{item.description}</div>
                <div className="col-span-2 text-center">{item.unitPrice} FCFA</div>
                <div className="col-span-3 text-center">{itemTotal} FCFA</div>
              </div>
            )
            })
          }
        </div>

        <div className="flex justify-between items-start">
        {/* QR Code */}
        <div className="flex flex-col items-center facture-qr-container">
          <div className="bg-white facture-qr p-3 border rounded-lg">
            <QRCodeSVG 
              value={generateQRData()}
              size={120}
              level="M"
             />
          </div>
          <p className="text-xs text-gray-600 mt-2 facture-qr-text text-center">
            Scan pour vérifier<br />la facture
          </p>
        </div>
        
        {/* Totaux */}
        <div className="w-80">
          <div className="flex justify-end">
              <span className="font-bold">Total: </span>
              <span className="font-bold ml-1">{totalHT} FCFA</span>
            </div>
        </div>
      </div>
      
            {/* <div className="flex justify-end">
              <span className="font-bold">Total: </span>
              <span className="font-bold ml-1">{totalHT} FCFA</span>
            </div> */}
        
         <div className="flex justify-center items-center my-5.5 signature ">
           <p className="font-bold underline signature">Signature</p>
         </div>

        <div className="mt-8 pt-4 border-t text-center text-xs">
          <p>Merci de noter que les produits achetés ne peuvent pas faire l’objet d’un retour !</p>
        </div>
      </div>
  );
})

InvoicePreview.displayName = 'InvoicePreview';

export default InvoicePreview;