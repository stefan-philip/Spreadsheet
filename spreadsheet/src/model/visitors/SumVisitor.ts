import {SpreadsheetModelVisitor} from "./SpreadsheetModelVisitor";
import {ISpreadsheetModel} from "../ISpreadsheetModel";
import { create, all } from 'mathjs'
import {columnIndexToLetter, letterToColumnIndex} from "../../util/utils";
import {CellReference} from "../CellReference";
import {RangeExpression} from "../RangeExpression";

export class SumVisitor implements SpreadsheetModelVisitor {

  private readonly range : RangeExpression;
  private result : number;

  constructor(range : RangeExpression) {
    this.range = range;
    this.result = 0;
  }

  visitModel(model: ISpreadsheetModel): void {

    const config = { }
    const math = create(all, config)
    let vals : string[] = [];

    let startColumnIndex = letterToColumnIndex(this.range.getStartRef().getColumn());
    let endColumnIndex = letterToColumnIndex(this.range.getEndRef().getColumn());

    let startRowIndex = this.range.getStartRef().getRow();
    let endRowIndex = this.range.getEndRef().getRow();

    for (let col = startColumnIndex; col <= endColumnIndex; col++) {
      for (let row = startRowIndex; row <= endRowIndex; row++) {
        let ref = new CellReference(row, columnIndexToLetter(col));
        let v = model.getCellValue(ref);
        console.log(v + ": "+v.length);
        if (v.length > 0) {
          console.log("should be here")
          vals.push(v);
        }
      }
    }

    console.log(vals);

    let expression = "";

    for (let i = 0; i < vals.length; i++) {
      expression = expression.concat(vals[i]);
      if (i !== vals.length - 1) {
        expression = expression.concat("+");
      }
    }
  console.log("Expression: " + expression);
    let r = math.evaluate(expression);
    if (r === undefined) {
      throw new Error("Invalid values in range");
    }
    this.result = r;
  }

  getResult() {
    return this.result;
  }

}