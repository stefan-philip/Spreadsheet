import {ISpreadsheetModel} from "../ISpreadsheetModel";

// Interface for Visitor pattern
export interface SpreadsheetModelVisitor {
  visitModel(model : ISpreadsheetModel) : void;
}
