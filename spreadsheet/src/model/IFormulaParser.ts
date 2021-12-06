import {Cell} from "./Cell";

export interface IFormulaParser {
  getReferencedCells(formula : string) : Cell[];
  parseFormula(formula : string) : string;
}