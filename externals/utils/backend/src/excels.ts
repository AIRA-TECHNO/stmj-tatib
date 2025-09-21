import dayjs from "dayjs";
import { Workbook, Worksheet } from "exceljs";
import fs from "fs";

interface structureResultExcelToJson {
  sheetName: string,
  rowStart?: number,
  readAs: {
    column: string,
    resultKey: string,
    readAs?: 'text' | 'value'
  }[],
}


export default class WorkbookToJson {
  constructor(workbook: Workbook) {
    this.workbook = workbook
  }

  private workbook: Workbook

  private sheetReader(ws: Worksheet, structure: Omit<structureResultExcelToJson, 'sheetName'>) {
    const results: any = []
    ws.getColumn('B').eachCell(async (_, rowNumber) => {
      if (rowNumber >= (structure.rowStart ?? 0)) {
        let itemResult: any = {}
        for (const { resultKey, column, readAs } of structure.readAs) {
          itemResult[resultKey] = ws.getCell(column + rowNumber)[readAs ?? 'text']
        }
        results.push(itemResult)
      }
    })
    return results
  }

  public convertCurrentSheetToJson(structures: structureResultExcelToJson[]) {
    const results: Record<string, any> = {};
    for (const structure of structures) {
      const ws = this.workbook.getWorksheet(structure.sheetName)
      if (ws) results[ws.name] = this.sheetReader(ws, structure)
    }
    return results
  }

  public convertAnySheetsToJson(structure: Omit<structureResultExcelToJson, 'sheetName'>) {
    const results: Record<string, any> = {};
    this.workbook.eachSheet((ws) => {
      results[ws.name] = this.sheetReader(ws, structure)
    })
    return results
  }
}


interface typeOptionBasicStyle {
  textCenter?: boolean;
  isBold?: boolean;
  textColor?: string;
  bgColor?: string;
  noBorder?: boolean;
}
export function basicStyleCellExcel(Cell: any, options?: typeOptionBasicStyle) {
  Cell.alignment = { ...(Cell.alignment ?? {}), vertical: 'middle' };
  if (options?.textCenter) Cell.alignment.horizontal = 'center';
  if (options?.isBold) Cell.font = { ...(Cell.font ?? {}), bold: true };
  if (options?.textColor) Cell.font = { ...(Cell.font ?? {}), color: { argb: options.textColor } };
  if (options?.bgColor) Cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: options?.bgColor } };
  Cell.border = options?.noBorder ? {} : {
    top: { style: 'thin', color: { argb: '000000' } },
    left: { style: 'thin', color: { argb: '000000' } },
    bottom: { style: 'thin', color: { argb: '000000' } },
    right: { style: 'thin', color: { argb: '000000' } },
  }
}


export async function uploadAndLoadExcel(file: File, pathFolder = 'uploads') {
  const buffer = await file.arrayBuffer();
  const fileName = `${dayjs().format('YYYYMMDDHHmmss')}-${file.name}`;
  const tempPath = `${pathFolder}/${fileName}`;
  fs.writeFileSync(tempPath, Buffer.from(buffer));
  const workbook = new Workbook();
  await workbook.xlsx.readFile(tempPath);
  return { workbook, tempPath, fileName };
}



export interface typeProtoSheet { label: string, name: string | ((dataRow: any) => any), width: number }