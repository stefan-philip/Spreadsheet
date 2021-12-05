import {SpreadsheetModel} from "./SpreadsheetModel";

// Interface for Visitor pattern
export interface SpreadsheetModelVisitor {
  visitModel(model : SpreadsheetModel) : void;
}
