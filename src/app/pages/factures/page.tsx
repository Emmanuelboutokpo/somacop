"use client"
import Footer from '@/components/Footer';
import InvoiceForm from '@/components/InvoiceForm';
import InvoicePreview from '@/components/InvoicePreview';
import Navbar from '@/components/Navbar';
import { InvoiceData } from '@/lib/type';
import { useEffect, useRef, useState } from 'react';


export default function Home() {
   const [invoiceData, setInvoiceData] = useState<InvoiceData>({
    companyName: 'SOMACOB',
    companyAddress: 'Route de Tori 2e rue après l\'église Origigi',
    companyPostalCode: '',
    companyCity: '',
    companySIRET: '',
    companyPhone: '0196734979 / 0197731665',
    clientName: '',
    clientAddress: '',
    clientPostalCode: '',
    clientCity: '',
    invoiceNumber: '',
    invoiceDate: new Date().toISOString().split('T')[0],
    deliveryDate: '',
    paymentDueDate: '',
    items: [{ quantity: 1, description: '', unitPrice: 0 }],
    additionalInfo: ''
  });

  const printRef = useRef<HTMLDivElement>(null);
  const [showPreview, setShowPreview] = useState(false);

  const updateInvoiceData = (field: keyof InvoiceData, value: any) => {
    setInvoiceData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const updateItem = (index: number, field: keyof InvoiceData['items'][0], value: any) => {
    const updatedItems = [...invoiceData.items];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value
    };
    setInvoiceData(prev => ({
      ...prev,
      items: updatedItems
    }));
  };

  const addItem = () => {
    setInvoiceData(prev => ({
      ...prev,
      items: [...prev.items, { quantity: 1, description: '', unitPrice: 0 }]
    }));
  };

    useEffect(() => {
    const lastItem = invoiceData.items[invoiceData.items.length - 1];
    if (lastItem.unitPrice > 0 && lastItem.description.trim() !== '') {
      // Vérifier si le dernier item n'est pas déjà vide
      const isEmpty = invoiceData.items.every(item => 
        item.quantity === 1 && item.description === '' && item.unitPrice === 0
      );
      
      if (!isEmpty) {
        addItem();
      }
    }
  }, [invoiceData.items]);

  const removeItem = (index: number) => {
    if (invoiceData.items.length > 1) {
      const updatedItems = [...invoiceData.items];
      updatedItems.splice(index, 1);
      setInvoiceData(prev => ({
        ...prev,
        items: updatedItems
      }));
    }
  };

 const handlePrint = () => {
    if (!showPreview) {
      setShowPreview(true);
      // Attendre que l'aperçu soit rendu avant d'imprimer
      setTimeout(() => {
        const printContent = printRef.current;
        if (printContent) {
          const printWindow = window.open('', '_blank');
          if (printWindow) {
            printWindow.document.write(`
              <!DOCTYPE html>
              <html>
                <head>
                  <title>Facture ${invoiceData.invoiceNumber}</title>
                  <style>
                    body { 
                      margin: 0; 
                      padding: 20px; 
                      font-family: Arial, sans-serif; 
                      font-size: 12px;
                      color: black;
                    }
                    .facture-container { 
                      border: 1px solid black; 
                      padding: 20px; 
                      max-width: 210mm;
                      margin: 0 auto;
                    }
                    .facture-wrapper {
                      padding : 10px
                    }
                    .signature{
                      display: flex; 
                      justify-content:center; 
                      align-items: center;
                      margin-top: 1rem; 
                      margin-bottom: 1rem;
                    }
                    .text-center { text-align: center; }
                    .text-right { text-align: right; }
                    .font-bold { font-weight: bold; }
                    .font-semibold { font-weight: 600; }
                    .grid { display: grid; }
                    .grid-cols-2 { grid-template-columns: 1fr 1fr; }
                    .grid-cols-12 { grid-template-columns: repeat(12, 1fr); }
                    .col-span-2 { grid-column: span 2; }
                    .col-span-7 { grid-column: span 7; }
                    .col-span-3 { grid-column: span 3; }
                    .gap-2 { gap: 0.5rem; }
                    .gap-8 { gap: 2rem; }
                    .mb-6 { margin-bottom: 1.5rem; }
                    .mb-1 { margin-bottom: 0.25rem; }
                    .mt-8 { margin-top: 2rem; }
                    .py-2 { padding-top: 1rem; padding-bottom: 1rem; }
                    .pb-2 { padding-bottom: 1rem; }
                    .pt-1 { padding-top: 1rem; }
                    .pt-4 { padding-top: 2rem; }
                    .p-6 { padding: 1.5rem; }
                    .border-b { border-bottom: 1px solid #e5e7eb; }
                    .border-b-2 { border-bottom: 2px solid black; }
                    .border-t { border-top: 1px solid #e5e7eb; }
                    .border-black { border-color: black; }
                    .flex { display: flex; }
                    .justify-between { justify-content: space-between; }
                    .justify-end { justify-content: flex-end; }
                    .w-64 { width: 16rem; }
                    .text-sm { font-size: 0.875rem; }
                    .text-xs { font-size: 0.75rem; }
                    .text-2xl { font-size: 1.5rem; }
                    .text-lg { font-size: 1.125rem; }
                  </style>
                </head>
                <body>
                  ${printContent.innerHTML}
                </body>
              </html>
            `);
            printWindow.document.close();
            printWindow.focus();
            
            // Attendre que le contenu soit chargé avant d'imprimer
            setTimeout(() => {
              printWindow.print();
              printWindow.close();
            }, 250);
          }
        }
      }, 100);
    } else {
      // Si l'aperçu est déjà visible, imprimer directement
      const printContent = printRef.current;
      if (printContent) {
        const printWindow = window.open('', '_blank');
        if (printWindow) {
          printWindow.document.write(`
            <!DOCTYPE html>
            <html>
              <head>
                <title>Facture ${invoiceData.invoiceNumber}</title>
                <style>
                  body { 
                    margin: 0; 
                    padding: 20px; 
                    font-family: Arial, sans-serif; 
                    font-size: 12px;
                    color: black;
                  }
                  .facture-container { 
                    border: 1px solid black; 
                    padding: 20px; 
                    max-width: 210mm;
                    margin: 0 auto;
                  }
                    .facture-wrapper {
                      padding : 10px
                    }

                    .signature{
                      display: flex; 
                      justify-content: center; 
                      align-items: center;
                      margin-top: 1rem; 
                      margin-bottom: 1rem;
                    }
                  .text-center { text-align: center; }
                  .text-right { text-align: right; }
                  .font-bold { font-weight: bold; }
                  .font-semibold { font-weight: 600; }
                  .grid { display: grid; }
                  .grid-cols-2 { grid-template-columns: 1fr 1fr; }
                  .grid-cols-12 { grid-template-columns: repeat(12, 1fr); }
                  .col-span-2 { grid-column: span 2; }
                  .col-span-7 { grid-column: span 7; }
                  .col-span-3 { grid-column: span 3; }
                  .gap-2 { gap: 0.5rem; }
                  .gap-8 { gap: 2rem; }
                  .mb-6 { margin-bottom: 1.5rem; }
                  .mb-1 { margin-bottom: 1rem; }
                  .mt-8 { margin-top: 2rem; }
                  .py-2 { padding-top: 1rem; padding-bottom: 1rem; }
                  .pb-2 { padding-bottom: 1rem; }
                  .pt-1 { padding-top: 1.5rem; }
                  .pt-4 { padding-top: 1.5rem; }
                  .p-6 { padding: 1.5rem; }
                  .border-b { border-bottom: 1px solid #e5e7eb; }
                  .border-b-2 { border-bottom: 1px solid black; }
                  .border-t { border-top: 1px solid #e5e7eb; }
                  .border-black { border-color: black; }
                  .flex { display: flex; }
                  .justify-between { justify-content: space-between; }
                  .justify-end { justify-content: flex-end; }
                  .w-64 { width: 16rem; }
                  .text-sm { font-size: 0.875rem; }
                  .text-xs { font-size: 0.75rem; }
                  .text-2xl { font-size: 1.5rem; }
                  .text-lg { font-size: 1.125rem; }
                </style>
              </head>
              <body>
                ${printContent.innerHTML}
              </body>
            </html>
          `);
          printWindow.document.close();
          printWindow.focus();
          
          setTimeout(() => {
            printWindow.print();
            printWindow.close();
          }, 250);
        }
      }
    }
  };

  
  const calculateTotals = () => {
    const totalHT = invoiceData.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    const tva = totalHT * 0.2;
    const totalTTC = totalHT + tva;
    
    return { totalHT, tva, totalTTC };
  };

  return (
   <>
    <Navbar/>
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Application de Facturation</h1>
        
        <div className="flex flex-col max-h-[500px] overflow-y-auto lg:flex-row gap-8">
          <div className="lg:w-1/2">
           <InvoiceForm 
            invoiceData={invoiceData}
            updateInvoiceData={updateInvoiceData}
            updateItem={updateItem}
            addItem={addItem}
            removeItem={removeItem}
            calculateTotals={calculateTotals}
            setShowPreview={setShowPreview}
            showPreview={showPreview}
            onPrint={handlePrint}
          />
          </div>
        
            <div className="lg:w-1/2" ref={printRef}>
              <InvoicePreview 
                invoiceData={invoiceData}
                calculateTotals={calculateTotals}
              />
            </div>
        </div>
      </div>
    </div>   
    <Footer/>
   </>
  );
}