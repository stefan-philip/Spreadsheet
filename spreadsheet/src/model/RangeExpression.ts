import {CellReference} from "./CellReference";
import {letterToColumnIndex} from "../util/utils";

export class RangeExpression {
  private startRef: CellReference;
  private endRef: CellReference;

  constructor(startRef: CellReference, endRef: CellReference) {
    this.startRef = startRef;
    this.endRef = endRef;
  }

  getStartRef(): CellReference {
    return this.startRef;
  }

  getEndRef(): CellReference {
    return this.endRef;
  }

  static createRangeExpression(rangeString: string): RangeExpression {
    if (!rangeString.includes("..")) {
      throw new Error("Invalid range expression");
    }

    let rangeSplit = rangeString.split("..");
    if (rangeSplit.length !== 2) {
      throw new Error("Invalid range expression");
    }

    let start = CellReference.createCellReference(rangeSplit[0]);
    let end = CellReference.createCellReference(rangeSplit[1]);

    if (letterToColumnIndex(end.getColumn()) < letterToColumnIndex(start.getColumn())) {
      throw new Error("Invalid range expression");
    }

    if (end.getRow() < start.getRow()) {
      throw new Error("Invalid range expression");
    }
    return new RangeExpression(start, end);
  }
}