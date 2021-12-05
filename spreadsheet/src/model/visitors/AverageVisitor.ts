import {SpreadsheetModelVisitor} from "./SpreadsheetModelVisitor";
import {CellReference, ISpreadsheetModel, RangeExpression} from "../ISpreadsheetModel";
import {columnIndexToLetter, letterToColumnIndex} from "../../util/utils";
import {SumVisitor} from "./SumVisitor";

export class AverageVisitor implements SpreadsheetModelVisitor {

  private readonly range : RangeExpression;
  private result : number;

  constructor(range : RangeExpression) {
    this.range = range;
    this.result = 0;
  }

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

  getResult() {
    return this.result;
  }

}