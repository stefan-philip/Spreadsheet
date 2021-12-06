import {ISpreadsheetModel} from "../ISpreadsheetModel";
import { create, all } from 'mathjs'
import {AbstractVisitor} from "./AbstractVisitor";

export class SumVisitor extends AbstractVisitor {

  visitModel(model: ISpreadsheetModel): void {
    const config = { }
    const math = create(all, config)
    let expression = "";
    let vals = this.getNonEmptyCellValues(model);

    for (let i = 0; i < vals.length; i++) {
      expression = expression.concat(vals[i]);
      if (i !== vals.length - 1) {
        expression = expression.concat("+");
      }
    }

    let r = math.evaluate(expression);
    if (r === undefined) {
      throw new Error("Invalid values in range");
    }
    this.result = r;
  }
}