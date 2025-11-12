'use client'

import { useRef, useEffect, useState } from 'react';
import { toPng } from 'html-to-image';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import {
  Document,
  Packer,
  Paragraph,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
  VerticalAlign,
  HeightRule,
  HeadingLevel
} from 'docx';
import { FaRegFilePdf, FaRegFileWord, FaRegTrashAlt } from "react-icons/fa";
import { PiMicrosoftExcelLogoBold } from "react-icons/pi";
import { useStore } from '@/store/useStore';
import { ExportModal } from '@/components/ExportModal';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';


export default function GestionDechargement() {
   const {
    products,
    depenses,
    removeProduct,
    updateProduct,
    updateDepense,
    getTotalMontantUsine,
    getTotalDepenses,
    getTotalPrixRevient,
    getTotalPrixVenteCotonou,
    getBenefices,
    getProductsWithCalculations
  } = useStore();

  // Calcul des valeurs
  const totalMontantUsine = getTotalMontantUsine();
  const totalDepensesValue = getTotalDepenses();
  const totalPrixRevient = getTotalPrixRevient();
  const totalPrixVenteCotonou = getTotalPrixVenteCotonou();
  const benefices = getBenefices();
  const productsWithCalculations = getProductsWithCalculations();

  const [showPdfModal, setShowPdfModal] = useState(false)
  const [showExcelModal, setShowExcelModal] = useState(false)
  const [showWordModal, setShowWordModal] = useState(false)
  const [exportFileName, setExportFileName] = useState('gestion-dechargement')
  
  const tableRef = useRef<HTMLDivElement>(null);

  // Gestion de l'ajout automatique
  useEffect(() => {
    const lastProduct = products[products.length - 1];
    if (lastProduct.article !== '' && lastProduct.quantite > 0 && 
        lastProduct.prixUsine > 0 && lastProduct.prixCotonou > 0) {
      useStore.getState().addProduct();
    }
  }, [products]);

  // Exportation en PDF
  // const exportToPDF = async (fileName: string) => {
  //   if (tableRef.current === null) return;

  //   try {
  //     const dataUrl = await toPng(tableRef.current, { backgroundColor: '#ffffff' });
  //     const link = document.createElement('a');
  //     link.download = `${fileName}.png`;
  //     link.href = dataUrl;
  //     link.click();
  //   } catch (error) {
  //     console.error('Erreur lors de l\'export PDF:', error);
  //   }
  // };

  // Exportation en Excel
  const exportToExcel = (fileName: string) => {
    // Filtrer les produits vides (dernière ligne vide)
    const produitsNonVides = productsWithCalculations.filter(p =>
      p.article !== '' || p.quantite > 0 || p.prixUsine > 0 ||
      p.prixCotonou > 0 || p.prixVenteCotonou > 0
    );

    const worksheet = XLSX.utils.json_to_sheet(
      produitsNonVides.map(product => ({
        'Article': product.article,
        'Quantité': product.quantite,
        'Prix Unitaire Usine': product.prixUsine,
        'Montant Usine': product.montantUsine,
        'Prix Unitaire Cotonou': product.prixCotonou,
        'Prix de Vente Cotonou': product.prixVenteCotonou,
      }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Déchargement');

    // Ajouter les dépenses
    const depensesSheet = XLSX.utils.json_to_sheet([
      { Dépenses: 'Douane', Montant: depenses.douane },
      { Dépenses: 'Transport', Montant: depenses.transport },
      { Dépenses: 'Imprévu', Montant: depenses.imprevu },
      { Dépenses: '', Montant: '' },

      { Dépenses: 'Total des dépenses', Montant: totalDepensesValue  },
      { Dépenses: 'Total montant usine', Montant: totalMontantUsine },
      { Dépenses: 'Total prix de revient', Montant: totalPrixRevient },
      { Dépenses: 'Total prix de vente à cotonou', Montant: totalPrixVenteCotonou },
      { Dépenses: 'Bénéfice', Montant: benefices }
    ]);

    XLSX.utils.book_append_sheet(workbook, depensesSheet, 'Dépenses et les totaux');

    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  };

  const exportToWord = async (fileName: string) => {
    const produitsNonVides = productsWithCalculations.filter(p =>
      p.article !== '' || p.quantite > 0 || p.prixUsine > 0 ||
      p.prixCotonou > 0 || p.prixVenteCotonou > 0
    );

    // Style pour les cellules d'en-tête (bg gris et centré)
    const headerCellStyle = {
      shading: { fill: "D3D3D3" }, // Fond gris
      verticalAlign: VerticalAlign.CENTER,
    };

    // Style pour le texte centré
    const centeredText = { alignment: AlignmentType.CENTER };

    const tableRows = produitsNonVides.map((product, id) =>
      new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph({ text: (id + 1).toString(), alignment: AlignmentType.CENTER })]
          }),
          new TableCell({
            children: [new Paragraph(product.article)]
          }),
          new TableCell({
            children: [new Paragraph({ text: product.quantite.toString(), alignment: AlignmentType.CENTER })]
          }),
          new TableCell({
            children: [new Paragraph({ text: product.prixUsine.toString(), alignment: AlignmentType.CENTER })]
          }),
          new TableCell({
            children: [new Paragraph({ text: product.montantUsine.toFixed(2), alignment: AlignmentType.CENTER })]
          }),
          new TableCell({
            children: [new Paragraph({ text: product.prixCotonou.toString(), alignment: AlignmentType.CENTER })]
          }),
          new TableCell({
            children: [new Paragraph({ text: product.prixVenteCotonou.toString(), alignment: AlignmentType.CENTER })]
          }),
        ],
        height: { value: 50, rule: HeightRule.AUTO }
      })
    );

    // Ajouter les dépenses avec numérotation
    const depensesRows = [
      new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph({ text: "1", alignment: AlignmentType.CENTER })],
          }),
          new TableCell({
            children: [new Paragraph({ text: 'Douane', alignment: AlignmentType.CENTER })],
          }),
          new TableCell({
            children: [new Paragraph({ text: depenses.douane.toString(), alignment: AlignmentType.CENTER })],
          })
        ],
        height: { value: 50, rule: HeightRule.AUTO }
      }),
      new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph({ text: "2", alignment: AlignmentType.CENTER })]
          }),
          new TableCell({
            children: [new Paragraph('Transport')]
          }),
          new TableCell({
            children: [new Paragraph({ text: depenses.transport.toString(), alignment: AlignmentType.CENTER })]
          })
        ],
        height: { value: 50, rule: HeightRule.AUTO }
      }),
      new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph({ text: "3", alignment: AlignmentType.CENTER })]
          }),
          new TableCell({
            children: [new Paragraph('Imprévu')]
          }),
          new TableCell({
            children: [new Paragraph({ text: depenses.imprevu.toString(), alignment: AlignmentType.CENTER })]
          })
        ],
        height: { value: 50, rule: HeightRule.AUTO }
      }),
    ];

    // Ajouter les totaux avec numérotation
    const totaux = [
      new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph({ text: "1", alignment: AlignmentType.CENTER })],
          }),
          new TableCell({
            children: [new Paragraph({ text: 'Total Dépenses', alignment: AlignmentType.CENTER })],
          }),
          new TableCell({
            children: [new Paragraph({ text: totalDepensesValue .toString(), alignment: AlignmentType.CENTER })],
          })
        ],
        height: { value: 50, rule: HeightRule.AUTO }
      }),
      new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph({ text: "2", alignment: AlignmentType.CENTER })]
          }),
          new TableCell({
            children: [new Paragraph('Total Montant Usine')]
          }),
          new TableCell({
            children: [new Paragraph({ text: totalMontantUsine.toString(), alignment: AlignmentType.CENTER })]
          })
        ]
      }),
      new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph({ text: "3", alignment: AlignmentType.CENTER })]
          }),
          new TableCell({
            children: [new Paragraph('Total Prix de Revient')]
          }),
          new TableCell({
            children: [new Paragraph({ text: totalPrixRevient.toString(), alignment: AlignmentType.CENTER })]
          })
        ]
      }),
      new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph({ text: "4", alignment: AlignmentType.CENTER })]
          }),
          new TableCell({
            children: [new Paragraph('Total Prix de vente à Cotonou')]
          }),
          new TableCell({
            children: [new Paragraph({ text: totalPrixVenteCotonou.toString(), alignment: AlignmentType.CENTER })]
          })
        ]
      }),
      new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph({ text: "5", alignment: AlignmentType.CENTER })]
          }),
          new TableCell({
            children: [new Paragraph('Bénéfices')]
          }),
          new TableCell({
            children: [new Paragraph({ text: benefices.toString(), alignment: AlignmentType.CENTER })]
          })
        ]
      }),
    ];

    // Tableau des produits - prend toute la largeur
    const table = new Table({
      width: { size: 1000, type: WidthType.PERCENTAGE },
      columnWidths: [800, 2000, 1000, 1500, 1500, 1500, 1500],
      rows: [
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph({ text: 'Numéro', alignment: AlignmentType.CENTER })],
              ...headerCellStyle
            }),
            new TableCell({
              children: [new Paragraph({ text: 'Article', alignment: AlignmentType.CENTER })],
              ...headerCellStyle
            }),
            new TableCell({
              children: [new Paragraph({ text: 'Quantité', alignment: AlignmentType.CENTER })],
              ...headerCellStyle
            }),
            new TableCell({
              children: [new Paragraph({ text: 'Prix Usine (FCFA)', alignment: AlignmentType.CENTER })],
              ...headerCellStyle
            }),
            new TableCell({
              children: [new Paragraph({ text: 'Montant Usine (FCFA)', alignment: AlignmentType.CENTER })],
              ...headerCellStyle
            }),
            new TableCell({
              children: [new Paragraph({ text: 'Prix Cotonou (FCFA)', alignment: AlignmentType.CENTER })],
              ...headerCellStyle
            }),
            new TableCell({
              children: [new Paragraph({ text: 'Prix Vente Cotonou (FCFA)', alignment: AlignmentType.CENTER })],
              ...headerCellStyle
            }),
          ],
          height: { value: 500, rule: HeightRule.AUTO }
        }),
        ...tableRows
      ]
    });

    // Tableau des dépenses - prend toute la largeur avec numérotation
    const depensesTable = new Table({
      width: { size: 1000, type: WidthType.PERCENTAGE },
      columnWidths: [800, 3000, 2000], // Ajuster les largeurs de colonnes
      rows: [
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph({ text: 'N°', alignment: AlignmentType.CENTER })],
              ...headerCellStyle
            }),
            new TableCell({
              children: [new Paragraph({ text: 'Dépenses', alignment: AlignmentType.CENTER })],
              ...headerCellStyle
            }),
            new TableCell({
              children: [new Paragraph({ text: 'Montant (FCFA)', alignment: AlignmentType.CENTER })],
              ...headerCellStyle
            })
          ],
          height: { value: 50, rule: HeightRule.AUTO }
        }),
        ...depensesRows
      ]
    });

    // Tableau des totaux - prend toute la largeur avec numérotation
    const totauxTable = new Table({
      width: { size: 1000, type: WidthType.PERCENTAGE },
      columnWidths: [800, 3000, 2000], // Ajuster les largeurs de colonnes
      rows: [
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph({ text: 'N°', alignment: AlignmentType.CENTER })],
              ...headerCellStyle
            }),
            new TableCell({
              children: [new Paragraph({ text: 'Totaux', alignment: AlignmentType.CENTER })],
              ...headerCellStyle
            }),
            new TableCell({
              children: [new Paragraph({ text: 'Montant (FCFA)', alignment: AlignmentType.CENTER })],
              ...headerCellStyle
            })
          ],
          height: { value: 50, rule: HeightRule.AUTO }
        }),
        ...totaux
      ]
    });

    const doc = new Document({
      sections: [
        {
          properties: {
            page: {
              margin: {
                top: 1000,
                right: 1000,
                bottom: 1000,
                left: 1000,
              }
            }
          },
          children: [
            new Paragraph({
              text: 'Gestion de Déchargement',
              heading: HeadingLevel.HEADING_1,
              alignment: AlignmentType.CENTER,
              spacing: { after: 400, before: 400 }
            }),
            new Paragraph({
              text: 'Détail des produits',
              heading: HeadingLevel.HEADING_2,
              alignment: AlignmentType.LEFT,
              spacing: { after: 200 }
            }),
            table,
            new Paragraph({
              text: 'Dépenses',
              heading: HeadingLevel.HEADING_2,
              alignment: AlignmentType.LEFT,
              spacing: { after: 200, before: 400 }
            }),
            depensesTable,
            new Paragraph({
              text: 'Totaux',
              heading: HeadingLevel.HEADING_2,
              alignment: AlignmentType.LEFT,
              spacing: { after: 200, before: 400 }
            }),
            totauxTable
          ]
        }
      ]
    });

    Packer.toBlob(doc).then(blob => {
      saveAs(blob, `${fileName}.docx`);
    });
  };

  return (
    <>
    <Navbar />
    <div className="min-h-screen bg-gray-100 py-6 px-4 sm:px-6 lg:px-8">
       {/* <ExportModal
        isOpen={showPdfModal}
        onClose={() => setShowPdfModal(false)}
        onConfirm={exportToPDF}
        defaultName={exportFileName}
        title="Exporter en PDF"
      /> */}
      
      <ExportModal
        isOpen={showExcelModal}
        onClose={() => setShowExcelModal(false)}
        onConfirm={exportToExcel}
        defaultName={exportFileName}
        title="Exporter en Excel"
      />
      
      <ExportModal
        isOpen={showWordModal}
        onClose={() => setShowWordModal(false)}
        onConfirm={exportToWord}
        defaultName={exportFileName}
        title="Exporter en Word"
      />
      <main className="max-w-7xl mx-auto space-y-8">
        <section className="bg-white rounded-lg p-6 shadow-md">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
            <h2 className="text-xl font-semibold text-blue-800 mb-2 md:mb-0">Produits</h2>
          </div>

          <div className="overflow-x-auto" ref={tableRef}>
            <div className="max-h-[300px] overflow-y-auto">
              <table className="min-w-full divide-y divide-gray-200 max-h-[200px] overflow-y-auto">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Numero</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Article</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantité</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prix Unitaire Usine (FCFA)</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Montant Usine (FCFA)</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prix Unitaire Cotonou (FCFA)</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prix de Vente Cotonou (FCFA)</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {productsWithCalculations.map((product, index) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex justify-center items-center">
                          <p className="bg-gray-50 font-semibold p-1 rounded-md">{index + 1}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <input
                          type="text"
                          className="w-full p-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                          value={product.article}
                           onChange={(e) => updateProduct(product.id, 'article', (e.target.value) || "")}
                          placeholder="Nom de l'article"
                        />
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <input
                          type="number"
                          className="w-full p-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                          value={product.quantite || ''}
                           onChange={(e) => updateProduct(product.id, 'quantite', parseInt(e.target.value) || 0)}
                          min="0"
                        />
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <input
                          type="number"
                          className="w-full p-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                          value={product.prixUsine || ""}
                          onChange={(e) => updateProduct(product.id, 'prixUsine', parseInt(e.target.value) || 0)}
                          min="0"
                        />
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap font-bold">
                        <p className="w-full p-1 border border-gray-300 rounded-md bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:outline-none">
                          {product.montantUsine.toLocaleString('fr-FR')}
                        </p>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <input
                          type="number"
                          className="w-full p-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                          value={product.prixCotonou || ''}
                          onChange={(e) => updateProduct(product.id, 'prixCotonou', parseInt(e.target.value) || 0)}
                          min="0"
                        />
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap font-bold">
                        <p className="w-full p-1 border border-gray-300 rounded-md bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:outline-none">
                          {(product.prixCotonou * product.quantite).toLocaleString('fr-FR')}
                        </p>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <button
                          className="bg-red-500 hover:bg-red-600 text-white p-1 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                          onClick={() => removeProduct(product.id)}
                          disabled={products.length <= 1}
                          title="Supprimer cet article"
                        >
                          <FaRegTrashAlt />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="flex mt-4 justify-end items-center gap-3">
            <div className='flex justify-between items-center gap-2'>
              {/* <button
                className="text-black border border-gray-300 hover:bg-gray-100 p-2 rounded-md flex items-center"
                 onClick={() => setShowPdfModal(true)}
                title="Exporter en PDF"
              >
                <FaRegFilePdf className="mr-1" />
                <span>PDF</span>
              </button> */}
              <button
                className="text-black border border-gray-300 hover:bg-gray-100 p-2 rounded-md flex items-center"
                onClick={() => setShowExcelModal(true)}
                title="Exporter en Excel"
              >
                <PiMicrosoftExcelLogoBold className="mr-1" />
                <span>Excel</span>
              </button>
              <button
                className="text-black border border-gray-300 hover:bg-gray-100 p-2 rounded-md flex items-center"
                onClick={() => setShowWordModal(true)}
                title="Exporter en Word"
              >
                <FaRegFileWord className="mr-1" />
                <span>Word</span>
              </button>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-lg p-6 shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-blue-800">Dépenses</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="flex flex-col">
              <label className="font-medium mb-1">Douane (FCFA)</label>
              <input
                type="number"
                className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={depenses.douane  || ''}
                onChange={(e) => updateDepense('douane', parseFloat(e.target.value) || 0)}
                min="0"
              />
            </div>
            <div className="flex flex-col">
              <label className="font-medium mb-1">Transport (FCFA)</label>
              <input
                type="number"
                className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={depenses.transport || ''}
                 onChange={(e) => updateDepense('transport', parseFloat(e.target.value) || 0)}
                min="0"
              />
            </div>
            <div className="flex flex-col">
              <label className="font-medium mb-1">Imprévu (FCFA)</label>
              <input
                type="number"
                className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={depenses.imprevu || ''}
                 onChange={(e) => updateDepense('imprevu', parseFloat(e.target.value) || 0)}
                min="0"
              />
            </div>
          </div>
        </section>

        <section className="bg-white border-l-4 border-blue-500 rounded-lg p-6 shadow-md md:w-4/12 ml-auto">
          <h2 className="text-xl font-semibold mb-4 text-blue-800">Totaux</h2>
          <div className="bg-blue-50 p-4 rounded-md">
            <p className="font-medium">Total Dépenses: <span className="text-blue-700">{totalDepensesValue.toLocaleString()} FCFA</span></p>
            <p className="font-medium">Total Montant Usine: <span className="text-blue-700">{totalMontantUsine.toLocaleString()} FCFA</span></p>
            <p className="font-medium">Total Prix de Revient: <span className="text-blue-700">{totalPrixRevient.toLocaleString()} FCFA</span></p>
            <p className="font-medium">Total Prix de vente à Cotonou: <span className="text-blue-700">{totalPrixVenteCotonou.toLocaleString()} FCFA</span></p>
            <p className="font-bold">Bénéfices: <span className={`${benefices >= 0 ? 'text-green-700' : 'text-red-700'}`}>{benefices.toLocaleString()} FCFA</span></p>
          </div>
        </section>
      </main>
    </div>
    <Footer />
    </>
  );
}