import {
  CellReference,
  CellStyle,
  ISpreadsheetModel, RangeExpression,
} from "./ISpreadsheetModel";
import {Cell} from "./Cell";
import {columnIndexToLetter, letterToColumnIndex} from "../util/utils";
import {SpreadsheetModelVisitor} from "./SpreadsheetModelVisitor";
import {FormulaParser} from "./FormulaParser";

export class SpreadsheetModel implements ISpreadsheetModel{
  private cellMap : Map<string, Cell>;
  private cellDependencies : Map<CellReference, CellReference[]>

  private numColumns;
  private numRows;

  private parser : FormulaParser;

  constructor() {
    this.cellMap = new Map<string, Cell>();
    this.cellDependencies = new Map<CellReference, CellReference[]>();
    this.numColumns = 12;
    this.numRows = 25;
    this.parser = new FormulaParser();
    this.initializeCells();
  }

  private initializeCells() : void {
    for (let i = 1; i <= this.numRows; i++) {
      for (let j = 1; j <= this.numColumns; j++) {
        let ref = new CellReference(i, columnIndexToLetter(j));
        let cell = new Cell();
        this.cellMap.set(ref.toString(), cell);
        this.cellDependencies.set(ref, []);
      }
    }
  }

  getCellFormula(reference: CellReference): string {
    return this.getCell(reference).getFormula();
  }

  getCellStyle(reference: CellReference): CellStyle {
    return this.getCell(reference).getStyle();
  }

  getCellValue(reference: CellReference): string {
    return this.getCell(reference).getValue() + "";
  }

  private getCell(reference : CellReference) : Cell {
    if (this.cellMap.has(reference.toString())) {
      let val = this.cellMap.get(reference.toString());
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

    let newMap = new Map<string, Cell>();

    this.cellMap.forEach((cell : Cell, refString : string) => {
      let ref = CellReference.createCellReference(refString);
      const refColNumber = letterToColumnIndex(ref.getColumn());

      if (refColNumber >= colNum) {
        newMap.set(new CellReference(ref.getRow(), columnIndexToLetter(refColNumber + 1)).toString(), cell);
      }
      else {
        newMap.set(refString, cell);
      }
    })

    for (let i = 1; i <= this.numRows; i++) {
      newMap.set(new CellReference(i, columnIndex).toString(), new Cell());
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

    let newMap = new Map<string, Cell>();

    this.cellMap.forEach((cell : Cell, refString : string) => {
      let ref = CellReference.createCellReference(refString);
      if (ref.getRow() >= rowIndex) {
        newMap.set(new CellReference(ref.getRow() + 1, ref.getColumn()).toString(), cell);
      }
      else {
        newMap.set(refString, cell);
      }
    })

    for (let i = 1; i <= this.numColumns; i++) {
      newMap.set(new CellReference(rowIndex, columnIndexToLetter(i)).toString(), new Cell());
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
    this.cellMap.set(reference.toString(), new Cell());
    this.cellDependencies.set(reference, []);
  }

  updateCellFormula(reference: CellReference, formula: string): void {
    this.validateCellReference(reference);
    let value = this.parser.parseFormula(formula, this, reference);
    console.log(reference.toString() + ": " + value);
    this.cellMap.get(reference.toString())?.setFormula(formula);
    this.cellMap.get(reference.toString())?.setValue(value);
  }

  updateCellStyle(reference: CellReference, style: CellStyle): void {
    this.validateCellReference(reference);
    this.cellMap.get(reference.toString())?.setStyle(style);
  }

  validateCellReference(ref : CellReference) : void {
    if (ref.getRow() < 1 || ref.getRow() > this.numRows) {
      throw new Error("Invalid Cell: bad row");
    }
    if (letterToColumnIndex(ref.getColumn()) < 1 || letterToColumnIndex(ref.getColumn()) > this.numColumns) {
      throw new Error("Invalid Cell: bad column");
    }
    if (ref.getColumn().toUpperCase() !== ref.getColumn()) {
      throw new Error("Invalid Cell Reference: bad column");
    }
  }

  validateRangeExpression(range: RangeExpression) {
    this.validateCellReference(range.getStartRef());
    this.validateCellReference(range.getEndRef());
  }
}