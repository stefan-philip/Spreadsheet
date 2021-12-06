import {SpreadsheetModel} from "./SpreadsheetModel";
import {SumVisitor} from "./visitors/SumVisitor";
import {ProductVisitor} from "./visitors/ProductVisitor";
import {AverageVisitor} from "./visitors/AverageVisitor";
import {all, create} from "mathjs";
import {CellReference} from "./CellReference";
import {RangeExpression} from "./RangeExpression";
import {Cell} from "./Cell";
import {columnIndexToLetter, letterToColumnIndex} from "../util/utils";
import {IFormulaParser} from "./IFormulaParser";

// Parser for a SpreadsheetModel
export class FormulaParser implements IFormulaParser {

  private model : SpreadsheetModel;

  constructor(model : SpreadsheetModel) {this.model = model;}

  // Returns a list of Cells that are referenced in the given formula
  getReferencedCells(formula : string) : Cell[] {
    let cells : Cell[] = [];

    let result = formula + "";
    while (result.includes("REF(")) {
      let i = result.indexOf("REF(");
      let end = result.indexOf(")", i + 4);

      let middle = result.substring(i + 4, end);

      let ref = CellReference.createCellReference(middle);
      this.model.validateCellReference(ref);
      cells.push(this.model.getCell(ref));
      result = result.replace("REF(" + middle + ")", "");
    }

    while (result.includes("SUM(")) {
      let i = result.indexOf("SUM(");
      let end = result.indexOf(")", i + 4);

      let middle = result.substring(i + 4, end);

      let range = RangeExpression.createRangeExpression(middle);
      this.model.validateRangeExpression(range);
      cells = cells.concat(this.getCellsFromRange(range));
      result = result.replace("SUM(" + middle + ")", "");
    }

    while (result.includes("AVG(")) {
      let i = result.indexOf("AVG(");
      let end = result.indexOf(")", i + 4);

      let middle = result.substring(i + 4, end);

      let range = RangeExpression.createRangeExpression(middle);
      this.model.validateRangeExpression(range);
      cells = cells.concat(this.getCellsFromRange(range));
      result = result.replace("AVG(" + middle + ")", "");
    }

    while (result.includes("PROD(")) {
      let i = result.indexOf("PROD(");
      let end = result.indexOf(")", i + 5);

      let middle = result.substring(i + 5, end);

      let range = RangeExpression.createRangeExpression(middle);
      this.model.validateRangeExpression(range);
      cells = cells.concat(this.getCellsFromRange(range));
      result = result.replace("PROD(" + middle + ")", "");
    }

    return cells;
  }

  private getCellsFromRange(range : RangeExpression) : Cell[] {
    let result : Cell[] = [];

    let startColumnIndex = letterToColumnIndex(range.getStartRef().getColumn());
    let endColumnIndex = letterToColumnIndex(range.getEndRef().getColumn());

    let startRowIndex = range.getStartRef().getRow();
    let endRowIndex = range.getEndRef().getRow();

    for (let col = startColumnIndex; col <= endColumnIndex; col++) {
      for (let row = startRowIndex; row <= endRowIndex; row++) {
        let ref = new CellReference(row, columnIndexToLetter(col));
        let cell = this.model.getCell(ref);
        result.push(cell);
      }
    }
    return result;
  }

  // Parses the given formula and returns an evaluated value
  // Implements REF, AVG, PROD, and SUM functions
  // String concatenation supported
  // Math expressions supported
  parseFormula(formula : string) : string {
    if (formula === "") {
      return "";
    }

    const config = { }
    const math = create(all, config)

    let originalDivide = math.divide;
    math.import({
      divide: function (a : any, b : any) {
        if (math.isZero(b)) {
          throw new Error('Divide by zero');
        }
        return originalDivide(a, b);
      }
    }, {override: true})

    let formulaCopy = this.replaceAllReferences(formula);
    formulaCopy = this.replaceAllFunctions(formulaCopy);

    if (formulaCopy.length == 0) {
      return "";
    }


    // may be string addition
    if (formulaCopy.includes("+") && !/\d/.test(formulaCopy)) {
      let split = formulaCopy.split("+");
      return split.join("");
    }

    if (/^[ ()\[\]0-9+\-*.\/]*$/.test(formulaCopy)) {
      let res = math.evaluate(formulaCopy);
      return res !== undefined ? res + "" : "wrong";
    }

    return formulaCopy;
  }

  private replaceAllFunctions(formula : string) : string {
    let result = this.replaceAllSum(formula);
    result = this.replaceAllAverage(result);
    result = this.replaceAllProduct(result);
    return result;
  }

  private replaceAllSum(formula : string) : string {
    let result = formula + "";

    while (result.includes("SUM(")) {
      let i = result.indexOf("SUM(");
      let end = result.indexOf(")", i + 4);

      let middle = result.substring(i + 4, end);

      let range = RangeExpression.createRangeExpression(middle);
      this.model.validateRangeExpression(range);
      let sumVisitor = new SumVisitor(range);
      this.model.accept(sumVisitor);
      result = result.replace("SUM(" + middle + ")", sumVisitor.getResult() + "");
    }

    return result;
  }

  private replaceAllAverage(formula : string) : string {
    let result = formula + "";

    while (result.includes("AVG(")) {
      let i = result.indexOf("AVG(");
      let end = result.indexOf(")", i + 4);

      let middle = result.substring(i + 4, end);

      let range = RangeExpression.createRangeExpression(middle);
      this.model.validateRangeExpression(range);
      let avgVisitor = new AverageVisitor(range);
      this.model.accept(avgVisitor);
      result = result.replace("AVG(" + middle + ")", avgVisitor.getResult() + "");
    }

    return result;
  }

  private replaceAllProduct(formula : string) : string {
    let result = formula + "";

    while (result.includes("PROD(")) {
      let i = result.indexOf("PROD(");
      let end = result.indexOf(")", i + 5);

      let middle = result.substring(i + 5, end);

      let range = RangeExpression.createRangeExpression(middle);
      this.model.validateRangeExpression(range);
      let productVisitor = new ProductVisitor(range);
      this.model.accept(productVisitor);
      result = result.replace("PROD(" + middle + ")", productVisitor.getResult() + "");
    }

    return result;
  }

  private replaceAllReferences(formula : string) : string {
    let result = formula + "";

    while (result.includes("REF(")) {
      let i = result.indexOf("REF(");
      let end = result.indexOf(")", i + 4);

      let middle = result.substring(i + 4, end);

      let ref = CellReference.createCellReference(middle);

      this.model.validateCellReference(ref);
      result = result.replace("REF(" + middle + ")", this.model.getCellValue(ref));
    }

    return result;
  }

}