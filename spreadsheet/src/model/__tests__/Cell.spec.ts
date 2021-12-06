import {Cell} from "../Cell";
import {CellStyle, RGBColor} from "../CellStyle";
import {IFormulaParser} from "../IFormulaParser";

class MockFormulaParser implements IFormulaParser {
  private readonly referencedCells : Cell[];

  constructor(referencedCells : Cell[]) { this.referencedCells = referencedCells;}
  getReferencedCells(formula: string): Cell[] {return this.referencedCells;}
  parseFormula(formula: string): string {return formula;}
}

class MockCell extends Cell {
  public numberOfTimesUpdated = 0;
  update(parser : IFormulaParser) {this.numberOfTimesUpdated++;}
}

it('empty cell', () => {
  let cell = new Cell();

  expect(cell.getFormula()).toEqual("");
  expect(cell.getStyle()).toEqual(new CellStyle(new RGBColor(255, 255, 255)));
  expect(cell.getValue()).toEqual("");
});

it('cell can contain a number', () => {
  let cell = new Cell();
  cell.setFormula("1", new MockFormulaParser([]));

  expect(cell.getFormula()).toEqual("1");
  expect(cell.getValue()).toEqual("1");
});

it('cell can contain a string', () => {
  let cell = new Cell();
  cell.setFormula("cat", new MockFormulaParser([]));

  expect(cell.getFormula()).toEqual("cat");
  expect(cell.getValue()).toEqual("cat");
});

it('cell dependencies are notified of updates', () => {
  let cell1 = new MockCell();
  cell1.setFormula("1", new MockFormulaParser([]));

  let cell2 = new Cell();
  cell2.setFormula("2", new MockFormulaParser([cell1]));

  expect(cell2.getFormula()).toEqual("2");
  expect(cell1.numberOfTimesUpdated).not.toEqual(0);
});
