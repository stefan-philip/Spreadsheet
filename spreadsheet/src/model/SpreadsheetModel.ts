import {
  CellReference,
  CellStyle,
  ISpreadsheetModel,
} from "./ISpreadsheetModel";
import {Cell} from "./Cell";
import {columnIndexToLetter} from "../util/utils";
import {SpreadsheetModelVisitor} from "./SpreadsheetModelVisitor";

export class SpreadsheetModel implements ISpreadsheetModel{
  private cellMap : Map<CellReference, Cell>;
  private cellDependencies : Map<CellReference, CellReference[]>

  private numColumns;
  private numRows;

  constructor() {
    this.cellMap = new Map<CellReference, Cell>();
    this.cellDependencies = new Map<CellReference, CellReference[]>();
    this.numColumns = 20;
    this.numRows = 50;
    this.initializeCells();
  }

  private initializeCells() : void {
    for (let i = 1; i <= this.numRows; i++) {
      for (let j = 1; j <= this.numColumns; j++) {
        let ref = new CellReference(i, columnIndexToLetter(j));
        let cell = new Cell();
        this.cellMap.set(ref, cell);
        this.cellDependencies.set(ref, []);
      }
    }
  }

  getCellFormula(reference: CellReference): string | number {
    return this.getCell(reference).getFormula();
  }

  getCellStyle(reference: CellReference): CellStyle {
    return this.getCell(reference).getStyle();
  }

  getCellValue(reference: CellReference): string | number {
    return this.getCell(reference).getValue();
  }

  private getCell(reference : CellReference) : Cell {
    if (this.cellMap.has(reference)) {
      let val = this.cellMap.get(reference);
      if (val) {
        return val;
      }
    }
    throw new Error("Invalid cell")
  }

  getNumberOfColumns(): number {return this.numColumns;}
  getNumberOfRows(): number {return this.numRows}

  accept(visitor: SpreadsheetModelVisitor): void {visitor.visitModel(this);}


}