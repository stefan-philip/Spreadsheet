import {SpreadsheetModelVisitor} from "./visitors/SpreadsheetModelVisitor";
import {CellReference} from "./CellReference";
import {CellStyle} from "./CellStyle";

// A model that has functionality for representing a spreadsheet
// where cells have formulas that compute to values, and cells
// automatically update their dependencies when they are updated.

// Model supports the Visitor pattern to extend functionality.
export interface ISpreadsheetModel {

  // Methods to query size information for the spreadsheet
  getNumberOfRows() : number;
  getNumberOfColumns() : number;

  // Methods to query cell specific information
  // Based on CellReference (location) of specific cell
  getCellValue(reference : CellReference) : string; // derived from cell formula
  getCellFormula(reference : CellReference) : string;
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
