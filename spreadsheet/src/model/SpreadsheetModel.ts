import {
  CellReference,
  CellStyle,
  ISpreadsheetModel,
} from "./ISpreadsheetModel";
import {Cell} from "./Cell";
import {columnIndexToLetter, letterToColumnIndex} from "../util/utils";
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

  addColumnToLeft(columnIndex: string): void {
    const colNum = letterToColumnIndex(columnIndex);

    if (colNum < 1 || colNum > this.numColumns) {
      throw new Error("Invalid column index");
    }

    let newMap = new Map<CellReference, Cell>();

    this.cellMap.forEach((cell : Cell, ref : CellReference) => {
      const refColNumber = letterToColumnIndex(ref.getColumn());

      if (refColNumber >= colNum) {
        newMap.set(new CellReference(ref.getRow(), columnIndexToLetter(refColNumber + 1)), cell);
      }
      else {
        newMap.set(ref, cell);
      }
    })

    for (let i = 1; i <= this.numRows; i++) {
      newMap.set(new CellReference(i, columnIndex), new Cell());
    }



    this.cellMap = newMap;
    this.numColumns++;

    // TODO update dependencies?
    //TODO update cell values?
  }

  addRowAbove(rowIndex: number): void {
    if (rowIndex < 1 || rowIndex > this.numRows) {
      throw new Error("Invalid row index");
    }

    let newMap = new Map<CellReference, Cell>();

    this.cellMap.forEach((cell : Cell, ref : CellReference) => {
      if (ref.getRow() >= rowIndex) {
        newMap.set(new CellReference(ref.getRow() + 1, ref.getColumn()), cell);
      }
      else {
        newMap.set(ref, cell);
      }
    })

    for (let i = 1; i <= this.numColumns; i++) {
      newMap.set(new CellReference(rowIndex, columnIndexToLetter(i)), new Cell());
    }
    this.cellMap = newMap;
    this.numRows++;

    // TODO update dependencies?
    //TODO update cell values?
  }

  removeColumn(columnIndex: string): void {

  }

  removeRow(rowIndex: number): void {

  }

  clearCell(reference: CellReference): void {
    this.validateCellReference(reference);
    this.cellMap.set(reference, new Cell());
    this.cellDependencies.set(reference, []);
  }

  updateCellFormula(reference: CellReference, formula: string): void {
    this.validateCellReference(reference);
    this.cellMap.get(reference)?.setFormula(formula);
  }

  updateCellStyle(reference: CellReference, style: CellStyle): void {
    this.validateCellReference(reference);
    this.cellMap.get(reference)?.setStyle(style);
  }

  private validateCellReference(ref : CellReference) : void {
    if (ref.getRow() < 1 || ref.getRow() > this.numRows) {
      throw new Error("Invalid Cell: bad row");
    }
    if (letterToColumnIndex(ref.getColumn()) < 1 || letterToColumnIndex(ref.getColumn()) > this.numColumns) {
      throw new Error("Invalid Cell: bad column");
    }
  }
}