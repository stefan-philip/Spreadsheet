import {ISpreadsheetModel} from "../ISpreadsheetModel";
import {SumVisitor} from "./SumVisitor";
import {AbstractVisitor} from "./AbstractVisitor";

export class AverageVisitor extends AbstractVisitor {

  visitModel(model: ISpreadsheetModel): void {

    let sumVisitor = new SumVisitor(this.range);
    model.accept(sumVisitor);
    let sum = sumVisitor.getResult();

    if (sum === 0) {
      this.result = 0;
      return;
    }

    let nonEmptyTerms : number = this.getNonEmptyCellValues(model).length;

    if (nonEmptyTerms === 0) {
      // unreachable because if sum is 0 (possible that non empty terms is 0) then we return
      throw new Error("Divide by zero error");
    }

    this.result = sum / nonEmptyTerms;
  }
}