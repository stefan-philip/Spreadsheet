import {SpreadsheetModelVisitor} from "./SpreadsheetModelVisitor";

export interface ISpreadsheetModel {

  // Methods to query size information for the spreadsheet
  getNumberOfRows() : number;
  getNumberOfColumns() : number;

  // Methods to query cell specific information
  // Based on CellReference (location) of specific cell
  getCellValue(reference : CellReference) : string | number; // derived from cell formula
  getCellFormula(reference : CellReference) : string | number;
  getCellStyle(reference : CellReference) : CellStyle;

  // Methods to update cell information
  clearCell(reference : CellReference) : void;
  updateCellFormula(reference : CellReference, formula : string) : void;
  updateCellStyle(reference : CellReference, style : CellStyle) : void;

  // Methods to structure the rows and columns of the spreadsheet
  addRowAbove(rowIndex : number) : void;
  addColumnToLeft(columnIndex : string) : void;
  removeRow(rowIndex : number) : void;
  removeColumn(columnIndex : string) : void;

  // Method to accept a visitor to extend functionality of the model
  accept(visitor : SpreadsheetModelVisitor) : void;

}

// Represents a position of a cell (numeric row and alphabetic column)
export class CellReference {
  private row : number;
  private column : string;

  constructor(row : number, column : string) {
    this.row = row;
    this.column = column;
  }

  getRow() : number {return this.row;}
  getColumn() : string {return this.column;}

}

// Represents the styling of a cell
export class CellStyle {
  private backgroundColor : Color;
  constructor(backgroundColor : Color) { this.backgroundColor = backgroundColor;}

  getBackgroundColor() : Color {return this.backgroundColor;}
  setBackgroundColor(color : Color) {this.backgroundColor = color;}
}

// Represents a color that can be translated to RGB values
export interface Color {
  getRed() : number;
  getGreen() : number;
  getBlue() : number;
}

// Represents a Color implementation of RGB
export class RGBColor {
  private readonly red : number;
  private readonly green : number;
  private readonly blue : number;

  constructor(red : number, green : number, blue : number) {
    this.red = red;
    this.green = green;
    this.blue = blue;
  }

  getRed() : number {return this.red}
  getGreen() : number {return this.green}
  getBlue() : number {return this.blue;}
}