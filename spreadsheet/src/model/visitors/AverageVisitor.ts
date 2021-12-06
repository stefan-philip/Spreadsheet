import {ISpreadsheetModel} from "../ISpreadsheetModel";
import {columnIndexToLetter, letterToColumnIndex} from "../../util/utils";
import {SumVisitor} from "./SumVisitor";
import {CellReference} from "../CellReference";
import {AbstractVisitor} from "./AbstractVisitor";

export class AverageVisitor extends AbstractVisitor {


  visitModel(model: ISpreadsheetModel): void {

    let sumVisitor = new SumVisitor(this.range);
    model.accept(sumVisitor);
    let sum = sumVisitor.getResult();

    let nonEmptyTerms : number = 0;

    let startColumnIndex = letterToColumnIndex(this.range.getStartRef().getColumn());
    let endColumnIndex = letterToColumnIndex(this.range.getEndRef().getColumn());

    let startRowIndex = this.range.getStartRef().getRow();
    let endRowIndex = this.range.getEndRef().getRow();

    for (let col = startColumnIndex; col <= endColumnIndex; col++) {
      for (let row = startRowIndex; row <= endRowIndex; row++) {
        let ref = new CellReference(row, columnIndexToLetter(col));
        let v = model.getCellValue(ref);

        if (v.length > 0) {
          nonEmptyTerms++;
        }
      }
    }

    if (nonEmptyTerms === 0) {
      throw new Error("Divide by zero error");
    }

    this.result = sum / nonEmptyTerms;
  }
}