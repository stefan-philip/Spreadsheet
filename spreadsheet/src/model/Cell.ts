import {CellStyle, RGBColor} from "./ISpreadsheetModel";

export class Cell implements IObserver, ISubject {

  private dependents : Set<IObserver>;

  private value : string;
  private formula : string;
  private style : CellStyle;


  constructor() {
    this.dependents = new Set<IObserver>();
    this.value = "";
    this.formula = "";
    this.style = new CellStyle(new RGBColor(255, 255, 255));
  }

  setFormula(formula : string) : void {
    // do formula valuation
    this.formula = formula;
    this.notifyObservers();// TODO:update dependencies
  }

  setValue(value : string) : void {
    // do formula valuation
    this.value = value;
    this.notifyObservers();
  }

  attach(observer : IObserver) {this.dependents.add(observer);}
  detach(observer: IObserver) {this.dependents.delete(observer);}

  notifyObservers() {
    this.dependents.forEach(d => {
      d.update();
    })
  }

  update() {
    //TODO
  }



  getFormula() : string { return this.formula };
  getValue() : string { return this.value };
  getStyle() : CellStyle { return this.style };

  setStyle(style : CellStyle) {this.style = style;}

}

interface IObserver {
  update() : void;
}

interface ISubject {
  attach(observer : IObserver) : void;
  detach(observer : IObserver) : void;
  notifyObservers() : void;
}
