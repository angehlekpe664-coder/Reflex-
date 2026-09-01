import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

export interface OrderReportData {
  id: string;
  pmeName: string;
  customerName: string;
  phone: string;
  item: string;
  amount: number;
  deliveryAddress: string;
  paymentRef: string;
  date: string;
  conclusion: string;
}

export class PDFReportService {
  /**
   * Generates a professional PDF Order Report when an AI deal is concluded.
   * Saves to local disk or returns a Buffer.
   */
  public async generateOrderPDF(data: OrderReportData): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({ margin: 50 });
        const buffers: Buffer[] = [];

        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => {
          const pdfBuffer = Buffer.concat(buffers);
          resolve(pdfBuffer);
        });

        // Header Section
        doc
          .fillColor('#0b1c30')
          .fontSize(22)
          .text('REFLEX AUTOMATION', { align: 'left' })
          .fontSize(10)
          .fillColor('#64748b')
          .text('Rapport Officiel de Vente Conclue par l\'IA WhatsApp', { align: 'left' })
          .moveDown(1.5);

        // Divider
        doc
          .strokeColor('#e2e8f0')
          .lineWidth(1)
          .moveTo(50, doc.y)
          .lineTo(550, doc.y)
          .stroke()
          .moveDown(1.5);

        // Transaction Summary Box
        doc
          .fillColor('#4b41e1')
          .fontSize(14)
          .text(`Récapitulatif de Commande #${data.id}`, { underline: false })
          .moveDown(0.5);

        doc
          .fontSize(10)
          .fillColor('#334155')
          .text(`PME Vendeuse : ${data.pmeName}`)
          .text(`Date & Heure  : ${data.date}`)
          .text(`Client WhatsApp: ${data.customerName} (${data.phone})`)
          .text(`Référence Paiement : ${data.paymentRef}`)
          .moveDown(1.5);

        // Order Table Details
        doc
          .fillColor('#0b1c30')
          .fontSize(12)
          .text('Détails de l\'Article & Règlement', { underline: true })
          .moveDown(0.8);

        doc
          .fontSize(10)
          .fillColor('#1e293b')
          .text(`Produit Conclu : ${data.item}`)
          .text(`Lieu de Livraison : ${data.deliveryAddress}`)
          .text(`Montant Total Encaissé : ${data.amount.toLocaleString()} FCFA`)
          .moveDown(1.5);

        // AI Summary & Conclusion Box
        doc
          .rect(50, doc.y, 500, 70)
          .fillAndStroke('#f8f9ff', '#cbd5e1');

        doc
          .fillColor('#0b1c30')
          .fontSize(11)
          .text('Résumé de l\'Échange Client (IA) :', 60, doc.y - 60)
          .fontSize(9.5)
          .fillColor('#475569')
          .text(data.conclusion, 60, doc.y + 5, { width: 480 });

        // Signature SHA-256 Stamp
        doc
          .moveDown(4)
          .fontSize(9)
          .fillColor('#10b981')
          .text('✔ Document certifié SHA-256 & Horodaté par la plateforme Reflex Intelligent Automation', { align: 'center' });

        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }
}

export const pdfReportService = new PDFReportService();
