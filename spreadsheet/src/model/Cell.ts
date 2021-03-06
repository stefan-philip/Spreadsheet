import {CellStyle, RGBColor} from "./CellStyle";
import {IFormulaParser} from "./IFormulaParser";

// Cells are both observers and subjects
// Updates to cell formula notifies all cells that depend on its value
export class Cell implements IObserver, ISubject {

  // should contain cells that reference this cell
  private dependents : Set<Cell>;

  private value : string;
  private formula : string;
  private style : CellStyle;

  constructor() {
    this.dependents = new Set<Cell>();
    this.value = "";
    this.formula = "";
    this.style = new CellStyle(new RGBColor(255, 255, 255));
  }

  setFormula(formula : string, parser : IFormulaParser) : void {

    // these two should throw error before we do any changes
    parser.parseFormula(formula);
    let cellsReferencedTo = parser.getReferencedCells(formula);

    if (cellsReferencedTo.includes(this)) {
      this.setFormula("", parser);
      throw new Error("Cell formula cannot reference itself. Clearing the formula...");
    }

    this.dependents.forEach((cell) => {
      cell.detach(this);
    })

    this.formula = formula;

    cellsReferencedTo.forEach((cell) => {
      cell.attach(this);
    })

    this.update(parser);
  }

  attach(observer : Cell) {this.dependents.add(observer);}
  detach(observer: Cell) {this.dependents.delete(observer);}

  update(parser : IFormulaParser) {
    this.value = parser.parseFormula(this.formula);
    this.notifyObservers(parser);
  }

  notifyObservers(parser : IFormulaParser) {
    this.dependents.forEach(d => {
      d.update(parser);
    })
  }

  getFormula() : string { return this.formula };
  getValue() : string { return this.value };
  getStyle() : CellStyle { return this.style };

  setStyle(style : CellStyle) {this.style = style;}

}

interface IObserver {
  update(parser : IFormulaParser) : void;
}

interface ISubject {
  attach(observer : IObserver) : void;
  detach(observer : IObserver) : void;
  notifyObservers(parser : IFormulaParser) : void;
}
