import {SumVisitor} from "../visitors/SumVisitor";
import {RangeExpression} from "../RangeExpression";
import {SpreadsheetModel} from "../SpreadsheetModel";
import {CellReference} from "../CellReference";

it('sum visitor works for row range', () => {
  let visitor = new SumVisitor(RangeExpression.createRangeExpression("A1..A3"));

  let model = new SpreadsheetModel();
  model.updateCellFormula(CellReference.createCellReference("A1"), "1");
  model.updateCellFormula(CellReference.createCellReference("A2"), "2");
  model.updateCellFormula(CellReference.createCellReference("A3"), "3");
  visitor.visitModel(model);

  expect(visitor.getResult()).toEqual(6);
});

it('sum visitor works for column range', () => {
  let visitor = new SumVisitor(RangeExpression.createRangeExpression("A1..C1"));

  let model = new SpreadsheetModel();
  model.updateCellFormula(CellReference.createCellReference("A1"), "1.1");
  model.updateCellFormula(CellReference.createCellReference("B1"), "2.1");
  model.updateCellFormula(CellReference.createCellReference("C1"), "3.1");
  visitor.visitModel(model);

  expect(visitor.getResult()).toBeCloseTo(6.3, 5);
});

it('sum visitor should be zero with empty values', () => {
  let visitor = new SumVisitor(RangeExpression.createRangeExpression("A1..C10"));

  let model = new SpreadsheetModel();
  visitor.visitModel(model);

  expect(visitor.getResult()).toEqual(0);
});

it('sum visitor works for full range', () => {
  let visitor = new SumVisitor(RangeExpression.createRangeExpression("A1..C2"));

  let model = new SpreadsheetModel();
  model.updateCellFormula(CellReference.createCellReference("A1"), "1");
  model.updateCellFormula(CellReference.createCellReference("B1"), "2");
  model.updateCellFormula(CellReference.createCellReference("C2"), "3");
  visitor.visitModel(model);

  expect(visitor.getResult()).toEqual(6);
});

it('sum visitor errors for range including non-numbers', () => {
  let visitor = new SumVisitor(RangeExpression.createRangeExpression("A1..C2"));

  let model = new SpreadsheetModel();
  model.updateCellFormula(CellReference.createCellReference("A1"), "1");
  model.updateCellFormula(CellReference.createCellReference("B1"), "stefan");
  model.updateCellFormula(CellReference.createCellReference("C2"), "3");

  expect(() => visitor.visitModel(model)).toThrowError();
});