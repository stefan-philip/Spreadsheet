import {ISpreadsheetModel} from "../ISpreadsheetModel";
import {SumVisitor} from "./SumVisitor";
import {AbstractVisitor} from "./AbstractVisitor";

export class AverageVisitor extends AbstractVisitor {

  visitModel(model: ISpreadsheetModel): void {

    let sumVisitor = new SumVisitor(this.range);
    model.accept(sumVisitor);
    let sum = sumVisitor.getResult();

    let nonEmptyTerms : number = this.getNonEmptyCellValues(model).length;

    if (nonEmptyTerms === 0) {
      throw new Error("Divide by zero error");
    }

    this.result = sum / nonEmptyTerms;
  }
}