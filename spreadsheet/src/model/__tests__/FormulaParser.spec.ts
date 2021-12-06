import {SpreadsheetModel} from "../SpreadsheetModel";
import {FormulaParser} from "../FormulaParser";
import {CellReference} from "../CellReference";

it('parse addition', () => {
  let parser = new FormulaParser(new SpreadsheetModel());
  expect(parser.parseFormula("1 + 1")).toEqual("2");
});

it('parse subtraction', () => {
  let parser = new FormulaParser(new SpreadsheetModel());
  expect(parser.parseFormula("1 - 2")).toEqual("-1");
});

it('parse multiplication', () => {
  let parser = new FormulaParser(new SpreadsheetModel());
  expect(parser.parseFormula("10*2")).toEqual("20");
});

it('parse division', () => {
  let parser = new FormulaParser(new SpreadsheetModel());
  expect(parser.parseFormula("1/2")).toEqual("0.5");
});

it('parse division : divide by zero', () => {
  let parser = new FormulaParser(new SpreadsheetModel());
  expect(() => parser.parseFormula("1/0")).toThrowError();
});

it('order of operations', () => {
  let parser = new FormulaParser(new SpreadsheetModel());
  expect(parser.parseFormula("1 + 2*3(1-2)")).toEqual("-5");
});

it('parser uses references correctly', () => {
  let model = new SpreadsheetModel();
  let parser = new FormulaParser(model);
  model.updateCellFormula(CellReference.createCellReference("A1"), "10")
  expect(parser.parseFormula("REF(A1)")).toEqual("10");
});


it('parser uses references correctly with addition', () => {
  let model = new SpreadsheetModel();
  let parser = new FormulaParser(model);
  model.updateCellFormula(CellReference.createCellReference("A1"), "10")
  expect(parser.parseFormula("REF(A1) + 10")).toEqual("20");
});

it('parser computes sum correctly', () => {
  let model = new SpreadsheetModel();
  let parser = new FormulaParser(model);
  model.updateCellFormula(CellReference.createCellReference("A1"), "10")
  model.updateCellFormula(CellReference.createCellReference("A3"), "11")
  expect(parser.parseFormula("SUM(A1..A3)")).toEqual("21");
});

it('parser computes average correctly', () => {
  let model = new SpreadsheetModel();
  let parser = new FormulaParser(model);
  model.updateCellFormula(CellReference.createCellReference("A1"), "10")
  model.updateCellFormula(CellReference.createCellReference("A3"), "12")
  expect(parser.parseFormula("AVG(A1..A3)")).toEqual("11");
});

it('parser computes sum correctly with reference ', () => {
  let model = new SpreadsheetModel();
  let parser = new FormulaParser(model);
  model.updateCellFormula(CellReference.createCellReference("A1"), "10")
  model.updateCellFormula(CellReference.createCellReference("A3"), "11")
  expect(parser.parseFormula("SUM(A1..A3) + REF(A1)")).toEqual("31");
});

it('parser concatenates strings', () => {
  let model = new SpreadsheetModel();
  let parser = new FormulaParser(model);
  model.updateCellFormula(CellReference.createCellReference("A1"), "zip")
  model.updateCellFormula(CellReference.createCellReference("A3"), "zap")
  expect(parser.parseFormula("REF(A1)+REF(A3)")).toEqual("zipzap");
});

it('parser concatenate string with number', () => {
  let model = new SpreadsheetModel();
  let parser = new FormulaParser(model);
  model.updateCellFormula(CellReference.createCellReference("A1"), "zip")
  model.updateCellFormula(CellReference.createCellReference("A3"), "0")
  expect(parser.parseFormula("REF(A1)+REF(A3)")).toEqual("zip+0");
});

it('parser concatenate number with string', () => {
  let model = new SpreadsheetModel();
  let parser = new FormulaParser(model);
  model.updateCellFormula(CellReference.createCellReference("A1"), "zip")
  model.updateCellFormula(CellReference.createCellReference("A3"), "0")
  expect(parser.parseFormula("REF(A3)+REF(A1)")).toEqual("0+zip");
});

it('parser errors with bad reference', () => {
  let model = new SpreadsheetModel();
  let parser = new FormulaParser(model);
  expect(() => parser.parseFormula("REF(A")).toThrowError();
});

it('parser errors with out of range reference', () => {
  let model = new SpreadsheetModel();
  let parser = new FormulaParser(model);
  expect(() => parser.parseFormula("REF(A10000)")).toThrowError();
});

it('parser errors with bad range', () => {
  let model = new SpreadsheetModel();
  let parser = new FormulaParser(model);
  expect(() => parser.parseFormula("SUM(A1..A")).toThrowError();
});

it('parser errors with out of range range', () => {
  let model = new SpreadsheetModel();
  let parser = new FormulaParser(model);
  expect(() => parser.parseFormula("SUM(A1..Z10000)")).toThrowError();
});