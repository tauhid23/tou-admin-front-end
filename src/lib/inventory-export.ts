import { strToU8, zipSync } from "fflate";
import type { InventoryExport, InventoryItem } from "./api/queries";

type Cell = string | number | Date | null | undefined;

function label(value: string) {
  return value.split("-").map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(" ");
}

function status(item: InventoryItem) {
  if (item.available <= 0) return "Out of stock";
  return item.available <= item.reorderPoint ? "Low stock" : "In stock";
}

function escapeXml(value: unknown) {
  return String(value ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}

function columnName(index: number) {
  let value = index + 1;
  let name = "";
  while (value > 0) { value -= 1; name = String.fromCharCode(65 + (value % 26)) + name; value = Math.floor(value / 26); }
  return name;
}

function cellXml(value: Cell, row: number, column: number, header = false) {
  const reference = `${columnName(column)}${row}`;
  const style = header ? ' s="1"' : "";
  if (typeof value === "number") return `<c r="${reference}"${style}><v>${Number.isFinite(value) ? value : 0}</v></c>`;
  const text = value instanceof Date ? value.toISOString().replace("T", " ").slice(0, 19) : String(value ?? "");
  return `<c r="${reference}" t="inlineStr"${style}><is><t xml:space="preserve">${escapeXml(text)}</t></is></c>`;
}

function sheetXml(rows: Cell[][], widths: number[]) {
  const lastColumn = columnName(Math.max(widths.length - 1, 0));
  const rowXml = rows.map((values, rowIndex) => `<row r="${rowIndex + 1}">${values.map((value, columnIndex) => cellXml(value, rowIndex + 1, columnIndex, rowIndex === 0)).join("")}</row>`).join("");
  const columns = widths.map((width, index) => `<col min="${index + 1}" max="${index + 1}" width="${width}" customWidth="1"/>`).join("");
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><dimension ref="A1:${lastColumn}${Math.max(rows.length, 1)}"/><sheetViews><sheetView workbookViewId="0"><pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews><cols>${columns}</cols><sheetData>${rowXml}</sheetData><autoFilter ref="A1:${lastColumn}${Math.max(rows.length, 1)}"/></worksheet>`;
}

function addFile(files: Record<string, Uint8Array>, path: string, content: string) {
  files[path] = strToU8(content);
}

function downloadWorkbook(sheets: Array<{ name: string; rows: Cell[][]; widths: number[] }>) {
  const files: Record<string, Uint8Array> = {};
  const overrides = sheets.map((_, index) => `<Override PartName="/xl/worksheets/sheet${index + 1}.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>`).join("");
  addFile(files, "[Content_Types].xml", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>${overrides}</Types>`);
  addFile(files, "_rels/.rels", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>`);
  const sheetNodes = sheets.map((sheet, index) => `<sheet name="${escapeXml(sheet.name)}" sheetId="${index + 1}" r:id="rId${index + 1}"/>`).join("");
  addFile(files, "xl/workbook.xml", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets>${sheetNodes}</sheets></workbook>`);
  const relationships = sheets.map((_, index) => `<Relationship Id="rId${index + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet${index + 1}.xml"/>`).join("");
  addFile(files, "xl/_rels/workbook.xml.rels", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">${relationships}<Relationship Id="rId${sheets.length + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>`);
  addFile(files, "xl/styles.xml", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><fonts count="2"><font><sz val="11"/><name val="Calibri"/></font><font><b/><color rgb="FFFFFFFF"/><sz val="11"/><name val="Calibri"/></font></fonts><fills count="3"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill><fill><patternFill patternType="solid"><fgColor rgb="FF0F172A"/><bgColor indexed="64"/></patternFill></fill></fills><borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders><cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs><cellXfs count="2"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/><xf numFmtId="0" fontId="1" fillId="2" borderId="0" xfId="0" applyFont="1" applyFill="1"/></cellXfs></styleSheet>`);
  sheets.forEach((sheet, index) => addFile(files, `xl/worksheets/sheet${index + 1}.xml`, sheetXml(sheet.rows, sheet.widths)));
  const archive = zipSync(files, { level: 6 });
  const blob = new Blob([archive.buffer as ArrayBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `sosbd-inventory-${new Date().toISOString().slice(0, 10)}.xlsx`;
  anchor.click();
  URL.revokeObjectURL(url);
}

export async function exportInventoryWorkbook(data: InventoryExport) {
  const onHand = data.inventory.reduce((sum, item) => sum + item.stock, 0);
  const reserved = data.inventory.reduce((sum, item) => sum + item.reserved, 0);
  const available = data.inventory.reduce((sum, item) => sum + item.available, 0);
  const incoming = data.inventory.reduce((sum, item) => sum + item.incoming, 0);
  const overview: Cell[][] = [
    ["Metric", "Value"], ["Report generated", new Date(data.generatedAt)], ["Products", data.inventory.length],
    ["On hand units", onHand], ["Reserved units", reserved], ["Available units", available], ["Incoming units", incoming],
    ["Low-stock products", data.inventory.filter((item) => status(item) === "Low stock").length],
    ["Out-of-stock products", data.inventory.filter((item) => status(item) === "Out of stock").length],
    ["Delivered sale lines", data.sales.length], ["Units sold", data.sales.reduce((sum, sale) => sum + sale.quantity, 0)],
    ["Gross delivered sales", data.sales.reduce((sum, sale) => sum + sale.lineTotal, 0)],
  ];
  const stockHeader: Cell[] = ["Product", "SKU", "Category", "Product status", "On hand", "Reserved", "Available", "Reorder point", "Incoming", "Warehouse", "Stock status", "Selling price", "Cost price", "Stock value", "Last updated"];
  const stockRow = (item: InventoryItem): Cell[] => [item.title, item.sku, label(item.category), label(item.status), item.stock, item.reserved, item.available, item.reorderPoint, item.incoming, item.warehouse, status(item), item.price, item.costPrice ?? 0, item.stock * (item.costPrice ?? 0), new Date(item.updatedAt)];
  const stockRows = [stockHeader, ...data.inventory.map(stockRow)];
  const reorderRows = [stockHeader, ...data.inventory.filter((item) => item.available <= item.reorderPoint).map(stockRow)];
  const salesRows: Cell[][] = [["Order", "Order date", "Delivered date", "Payment", "Customer", "Product", "SKU", "Quantity", "Unit price", "Line total", "Color", "Size"], ...data.sales.map((sale) => [sale.orderNumber, new Date(sale.orderDate), sale.deliveredAt ? new Date(sale.deliveredAt) : "", label(sale.paymentStatus), sale.customerName, sale.product, sale.sku, sale.quantity, sale.unitPrice, sale.lineTotal, sale.selectedColor ?? "", sale.selectedSize ?? ""])];
  const movementRows: Cell[][] = [["Date", "Type", "Product", "SKU", "Stock change", "Stock before", "Stock after", "Reserved before", "Reserved after", "Incoming before", "Incoming after", "Warehouse", "Reference", "Reason", "Recorded by"], ...data.movements.map((movement) => [new Date(movement.createdAt), label(movement.type), movement.productTitle, movement.sku, movement.quantityChange, movement.stockBefore, movement.stockAfter, movement.reservedBefore, movement.reservedAfter, movement.incomingBefore, movement.incomingAfter, movement.warehouse, movement.reference, movement.reason, movement.changedByEmail])];
  downloadWorkbook([
    { name: "Overview", rows: overview, widths: [28, 24] },
    { name: "Stock", rows: stockRows, widths: [34, 18, 20, 15, 12, 12, 12, 15, 12, 22, 16, 15, 15, 16, 20] },
    { name: "Reorder", rows: reorderRows, widths: [34, 18, 20, 15, 12, 12, 12, 15, 12, 22, 16, 15, 15, 16, 20] },
    { name: "Delivered Sales", rows: salesRows, widths: [24, 20, 20, 14, 24, 34, 18, 12, 14, 14, 16, 12] },
    { name: "Movement History", rows: movementRows, widths: [20, 16, 34, 18, 14, 14, 14, 16, 16, 16, 16, 22, 20, 42, 28] },
  ]);
}
