import {Cell} from "./Cell";

// Represents a parser for a spreadsheet model
export interface IFormulaParser {
  getReferencedCells(formula : string) : Cell[];
  parseFormula(formula : string) : string;
}