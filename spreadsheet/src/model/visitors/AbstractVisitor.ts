import {SpreadsheetModelVisitor} from "./SpreadsheetModelVisitor";
import {RangeExpression} from "../RangeExpression";
import {ISpreadsheetModel} from "../ISpreadsheetModel";

export abstract class AbstractVisitor implements SpreadsheetModelVisitor {

  protected readonly range : RangeExpression;
  protected result : number;

  constructor(range : RangeExpression) {
    this.range = range;
    this.result = 0;
  }

  abstract visitModel(model: ISpreadsheetModel) : void;

  getResult() : number {
    return this.result;
  }
}