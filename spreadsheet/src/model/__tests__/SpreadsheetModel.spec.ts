import {SpreadsheetModel} from "../SpreadsheetModel";
import {columnIndexToLetter} from "../../util/utils";
import {CellReference} from "../CellReference";
import {SpreadsheetModelVisitor} from "../visitors/SpreadsheetModelVisitor";
import {ISpreadsheetModel} from "../ISpreadsheetModel";

it('spreadsheet initialized correctly', () => {

  let model = new SpreadsheetModel();
  let rows = model.getNumberOfRows();
  let cols = model.getNumberOfColumns();

  for (let i = 1; i <= rows; i++) {
    for (let j = 1; j <= cols; j++) {
      let ref = new CellReference(i, columnIndexToLetter(j));
      expect(model.getCellFormula(ref)).toEqual("");
      expect(model.getCellValue(ref)).toEqual("");
    }
  }
});

it('model accepts visitor', () => {

  class MockVisitor implements SpreadsheetModelVisitor {
    visitedModel = false;
    visitModel(model: ISpreadsheetModel): void {this.visitedModel = true;}
  }

  let model = new SpreadsheetModel();
  let visitor = new MockVisitor();
  model.accept(visitor);
  expect(visitor.visitedModel).toBeTruthy();
});

it('update formula (number) for cell changes cell value', () => {
  let model = new SpreadsheetModel();

  model.updateCellFormula(CellReference.createCellReference("A1"), "1");
  expect(model.getCellFormula(CellReference.createCellReference("A1"))).toEqual("1");
  expect(model.getCellValue(CellReference.createCellReference("A1"))).toEqual("1");
});

it('update formula (reference) for cell changes cell value', () => {
  let model = new SpreadsheetModel();

  model.updateCellFormula(CellReference.createCellReference("A1"), "1");
  model.updateCellFormula(CellReference.createCellReference("A2"), "REF(A1) + 5")
  expect(model.getCellValue(CellReference.createCellReference("A2"))).toEqual("6");
});

it('update formula (reference) for cell changes dependents value', () => {
  let model = new SpreadsheetModel();

  model.updateCellFormula(CellReference.createCellReference("A1"), "1");
  model.updateCellFormula(CellReference.createCellReference("A2"), "REF(A1) + 5")
  expect(model.getCellValue(CellReference.createCellReference("A2"))).toEqual("6");

  model.updateCellFormula(CellReference.createCellReference("A1"), "2");
  expect(model.getCellValue(CellReference.createCellReference("A2"))).toEqual("7");
});

it('clear cell clears formula and value', () => {
  let model = new SpreadsheetModel();

  model.updateCellFormula(CellReference.createCellReference("A1"), "1");
  expect(model.getCellValue(CellReference.createCellReference("A1"))).toEqual("1");

  model.clearCell(CellReference.createCellReference("A1"));
  expect(model.getCellFormula(CellReference.createCellReference("A1"))).toEqual("");
  expect(model.getCellValue(CellReference.createCellReference("A1"))).toEqual("");
});

it('clear cell updates dependencies', () => {
  let model = new SpreadsheetModel();

  model.updateCellFormula(CellReference.createCellReference("A1"), "1");
  model.updateCellFormula(CellReference.createCellReference("A2"), "REF(A1) + 5");
  expect(model.getCellValue(CellReference.createCellReference("A2"))).toEqual("6");

  model.clearCell(CellReference.createCellReference("A1"));

  expect(model.getCellValue(CellReference.createCellReference("A2"))).toEqual("5");
});

it('add row above creates new empty row', () => {
  let model = new SpreadsheetModel();
  let originalNumberOfRows = model.getNumberOfRows();

  model.updateCellFormula(CellReference.createCellReference("A1"), "1");
  expect(model.getCellValue(CellReference.createCellReference("A1"))).toEqual("1");

  model.addRowAbove(1);
  expect(model.getCellValue(CellReference.createCellReference("A1"))).toEqual("");
  expect(model.getCellValue(CellReference.createCellReference("A2"))).toEqual("1");
  expect(model.getNumberOfRows()).toEqual(originalNumberOfRows + 1);

});

it('add row updates cell values from dependencies', () => {
  let model = new SpreadsheetModel();

  model.updateCellFormula(CellReference.createCellReference("A1"), "1");
  model.updateCellFormula(CellReference.createCellReference("A2"), "REF(A1)")
  expect(model.getCellValue(CellReference.createCellReference("A2"))).toEqual("1");

  model.addRowAbove(1);
  expect(model.getCellValue(CellReference.createCellReference("A3"))).toEqual("");

});

it('add column to left creates new empty column', () => {
  let model = new SpreadsheetModel();
  let originalNumberOfCols = model.getNumberOfColumns();

  model.updateCellFormula(CellReference.createCellReference("A1"), "1");
  expect(model.getCellValue(CellReference.createCellReference("A1"))).toEqual("1");

  model.addColumnToLeft("A");
  expect(model.getCellValue(CellReference.createCellReference("A1"))).toEqual("");
  expect(model.getCellValue(CellReference.createCellReference("B1"))).toEqual("1");
  expect(model.getNumberOfColumns()).toEqual(originalNumberOfCols + 1);

});

it('add column updates cell values from dependencies', () => {
  let model = new SpreadsheetModel();

  model.updateCellFormula(CellReference.createCellReference("A1"), "1");
  model.updateCellFormula(CellReference.createCellReference("B1"), "REF(A1)")
  expect(model.getCellValue(CellReference.createCellReference("B1"))).toEqual("1");

  model.addRowAbove(1);
  expect(model.getCellValue(CellReference.createCellReference("C1"))).toEqual("");
});

it('remove row removes row', () => {
  let model = new SpreadsheetModel();
  let originalNumberOfRows = model.getNumberOfRows();

  model.updateCellFormula(CellReference.createCellReference("A1"), "1");
  model.updateCellFormula(CellReference.createCellReference("A2"), "2");
  model.updateCellFormula(CellReference.createCellReference("A3"), "3");

  model.removeRow(2);

  expect(model.getCellValue(CellReference.createCellReference("A1"))).toEqual("1");
  expect(model.getCellValue(CellReference.createCellReference("A2"))).toEqual("3");
  expect(model.getCellValue(CellReference.createCellReference("A3"))).toEqual("");
  expect(model.getNumberOfRows()).toEqual(originalNumberOfRows - 1);
});

it('remove row always leaves at least 1 row', () => {
  let model = new SpreadsheetModel();
  let originalNumberOfRows = model.getNumberOfRows();

  for (let i = 0; i < originalNumberOfRows + 10; i++) {
    model.removeRow(1);
  }

  expect(model.getNumberOfRows()).toEqual(1);
});

it('remove col removes col', () => {
  let model = new SpreadsheetModel();
  let originalNumberOfColumns = model.getNumberOfColumns();

  model.updateCellFormula(CellReference.createCellReference("A1"), "1");
  model.updateCellFormula(CellReference.createCellReference("B1"), "2");
  model.updateCellFormula(CellReference.createCellReference("C1"), "3");

  model.removeColumn("B");

  expect(model.getCellValue(CellReference.createCellReference("A1"))).toEqual("1");
  expect(model.getCellValue(CellReference.createCellReference("B1"))).toEqual("3");
  expect(model.getCellValue(CellReference.createCellReference("C1"))).toEqual("");
  expect(model.getNumberOfColumns()).toEqual(originalNumberOfColumns - 1);
});

it('remove col always leaves at least 1 col', () => {
  let model = new SpreadsheetModel();
  let originalNumberOfCols = model.getNumberOfColumns();

  for (let i = 0; i < originalNumberOfCols + 10; i++) {
    model.removeColumn("A");
  }

  expect(model.getNumberOfColumns()).toEqual(1);
});


it('remove row updates dependencies', () => {
  let model = new SpreadsheetModel();

  model.updateCellFormula(CellReference.createCellReference("A1"), "1");
  model.updateCellFormula(CellReference.createCellReference("A2"), "2");
  model.updateCellFormula(CellReference.createCellReference("A3"), "REF(A1)");

  expect(model.getCellValue(CellReference.createCellReference("A3"))).toEqual("1");

  model.removeRow(1);

  expect(model.getCellValue(CellReference.createCellReference("A1"))).toEqual("2");
  expect(model.getCellValue(CellReference.createCellReference("A2"))).toEqual("2");
  expect(model.getCellValue(CellReference.createCellReference("A3"))).toEqual("");
});

it('remove column updates dependencies', () => {
  let model = new SpreadsheetModel();

  model.updateCellFormula(CellReference.createCellReference("A1"), "1");
  model.updateCellFormula(CellReference.createCellReference("B1"), "2");
  model.updateCellFormula(CellReference.createCellReference("C1"), "REF(A1)");

  expect(model.getCellValue(CellReference.createCellReference("C1"))).toEqual("1");

  model.removeColumn("A");

  expect(model.getCellValue(CellReference.createCellReference("A1"))).toEqual("2");
  expect(model.getCellValue(CellReference.createCellReference("B1"))).toEqual("2");
  expect(model.getCellValue(CellReference.createCellReference("C1"))).toEqual("");
});
