import {ISpreadsheetModel} from "../ISpreadsheetModel";
import { create, all } from 'mathjs'
import {columnIndexToLetter, letterToColumnIndex} from "../../util/utils";
import {CellReference} from "../CellReference";
import {AbstractVisitor} from "./AbstractVisitor";

export class ProductVisitor extends AbstractVisitor {

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

        if (v.length > 0) {
          vals.push(v);
        }
      }
    }

    let expression = "";

    for (let i = 0; i < vals.length; i++) {
      expression = expression.concat(vals[i]);
      if (i !== vals.length - 1) {
        expression = expression.concat("*");
      }
    }

    let r = math.evaluate(expression);
    if (r === undefined) {
      throw new Error("Invalid values in range");
    }
    this.result = r;
  }
}