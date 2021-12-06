import {SpreadsheetModelVisitor} from "./SpreadsheetModelVisitor";
import {ISpreadsheetModel} from "../ISpreadsheetModel";
import {columnIndexToLetter} from "../../util/utils";
import {CellReference} from "../CellReference";

export class ExcelDataVisitor implements SpreadsheetModelVisitor {
  private readonly result : any[];

  constructor() {this.result = [];}

  visitModel(model: ISpreadsheetModel): void {
    for (let i = 1; i <= model.getNumberOfRows(); i++) {
      let row = [];

      for (let j = 1; j <= model.getNumberOfColumns(); j++) {
        row.push({
          value: model.getCellValue(new CellReference(i, columnIndexToLetter(j))),
          type: String,
        });
      }
      this.result.push(row);
    }
  }

  getResult() : any {
    return this.result;
  }

}