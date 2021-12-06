import {SpreadsheetModelVisitor} from "./SpreadsheetModelVisitor";
import {RangeExpression} from "../RangeExpression";
import {ISpreadsheetModel} from "../ISpreadsheetModel";
import {columnIndexToLetter, letterToColumnIndex} from "../../util/utils";
import {CellReference} from "../CellReference";

// Abstract Visitor that contains a range and a method to obtain a numeric result
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
  
  protected getNonEmptyCellValues(model : ISpreadsheetModel) : string[] {
    let vals : string[] = [];

    let startColumnIndex = letterToColumnIndex(this.range.getStartRef().getColumn());
    let endColumnIndex = letterToColumnIndex(this.range.getEndRef().getColumn());

    let startRowIndex = this.range.getStartRef().getRow();
    let endRowIndex = this.range.getEndRef().getRow();

    for (let col = startColumnIndex; col <= endColumnIndex; col++) {
      for (let row = startRowIndex; row <= endRowIndex; row++) {
        let ref = new CellReference(row, columnIndexToLetter(col));
        let v = model.getCellValue(ref);
        if (v.length > 0) {
          vals.push(v);
        }
      }
    }
    return vals;
  }
}