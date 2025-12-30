import { PDFDocument, rgb } from "pdf-lib";

interface InvoiceData {
  invoiceNumber: string;
  date: string;
  totalAmount: string;
  productName: string;
  price: string;
  transactionId: any;
  // Add more invoice data as needed
}

const generateInvoicePdf = async (
  invoiceData: InvoiceData
): Promise<Uint8Array> => {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([400, 600]);

  const font = await pdfDoc.embedFont("Helvetica");
  const fontSize = 12;
  const lineHeight = fontSize * 1.2;

  let y = 500;
  page.drawText("Invoice", {
    x: 200,
    y,
    font,
    size: fontSize,
    color: rgb(0, 0, 0),
  });
  y -= lineHeight;

  // Draw other data
  for (const [key, value] of Object.entries(invoiceData)) {
    if (key !== "image") {
      page.drawText(`${key}: ${value}`, {
        x: 50,
        y,
        font,
        size: fontSize,
        color: rgb(0, 0, 0),
      });
      y -= lineHeight;
    }
  }

  return pdfDoc.save();
};

export default generateInvoicePdf;
