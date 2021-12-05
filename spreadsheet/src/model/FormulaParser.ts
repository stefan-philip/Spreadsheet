import {CellReference, RangeExpression} from "./ISpreadsheetModel";
import {SpreadsheetModel} from "./SpreadsheetModel";
import {SumVisitor} from "./visitors/SumVisitor";
import {ProductVisitor} from "./visitors/ProductVisitor";
import {AverageVisitor} from "./visitors/AverageVisitor";
import {all, create} from "mathjs";

export class FormulaParser {

  private static supportedFunctions = ["SUM", "AVG", "PROD", "REF"];

  parseFormula(formula : string, model : SpreadsheetModel, reference : CellReference) : string {
    if (formula === "") {
      return "";
    }

    // SUM AVG PROD should always contain range expression
    // REF should always have cell reference
    //    replace REF with cell value

    // 1 + REF(A1) + 7 * SUM(A2..B5)
    const config = { }
    const math = create(all, config)

    let formulaCopy = this.replaceAllReferences(formula, model);
    formulaCopy = this.replaceAllFunctions(formulaCopy, model);
    let res = math.evaluate(formulaCopy);
    return res !== undefined ? res : "wrong";
  }

  private replaceAllFunctions(formula : string, model : SpreadsheetModel) : string {
    let result = this.replaceAllSum(formula, model);
    result = this.replaceAllAverage(result, model);
    result = this.replaceAllProduct(result, model);
    return result;
  }

  private replaceAllSum(formula : string, model : SpreadsheetModel) : string {
    let result = formula + "";

    while (result.includes("SUM(")) {
      let i = result.indexOf("SUM(");
      let end = result.indexOf(")", i + 4);

      let middle = result.substring(i + 4, end);

      let range = RangeExpression.createRangeExpression(middle);
      model.validateRangeExpression(range);
      let sumVisitor = new SumVisitor(range);
      model.accept(sumVisitor);
      result = result.replace("SUM(" + middle + ")", sumVisitor.getResult() + "");
    }

    return result;
  }

  private replaceAllAverage(formula : string, model : SpreadsheetModel) : string {
    let result = formula + "";

    while (result.includes("AVG(")) {
      let i = result.indexOf("AVG(");
      let end = result.indexOf(")", i + 4);

      let middle = result.substring(i + 4, end);

      let range = RangeExpression.createRangeExpression(middle);
      model.validateRangeExpression(range);
      let avgVisitor = new AverageVisitor(range);
      model.accept(avgVisitor);
      result = result.replace("AVG(" + middle + ")", avgVisitor.getResult() + "");
    }

    return result;
  }

  private replaceAllProduct(formula : string, model : SpreadsheetModel) : string {
    let result = formula + "";

    while (result.includes("PROD(")) {
      let i = result.indexOf("PROD(");
      let end = result.indexOf(")", i + 5);

      let middle = result.substring(i + 5, end);

      let range = RangeExpression.createRangeExpression(middle);
      model.validateRangeExpression(range);
      let productVisitor = new ProductVisitor(range);
      model.accept(productVisitor);
      result = result.replace("PROD(" + middle + ")", productVisitor.getResult() + "");
    }

    return result;
  }

  private replaceAllReferences(formula : string, model : SpreadsheetModel) : string {
    let result = formula + "";

    while (result.includes("REF(")) {
      let i = result.indexOf("REF(");
      let end = result.indexOf(")", i + 4);

      let middle = result.substring(i + 4, end);

      let ref = CellReference.createCellReference(middle);

      model.validateCellReference(ref);
      result = result.replace("REF(" + middle + ")", model.getCellValue(ref));
    }

    return result;
  }



}