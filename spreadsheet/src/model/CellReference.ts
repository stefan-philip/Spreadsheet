// Represents a position of a cell (numeric row and alphabetic column)
export class CellReference {
  private readonly row: number;
  private readonly column: string;

  constructor(row: number, column: string) {
    this.row = row;
    this.column = column;
  }

  // Factory method for cell references based on a string "A1" --> CellReference(1, "A")
  static createCellReference(refString: string): CellReference {
    let col = "";
    let row = "";

    for (let i = 0; i < refString.length; i++) {
      let c = refString.charAt(i);
      if (c.toLowerCase() !== c.toUpperCase()) {
        col = col + c;
      } else {
        row = refString.substring(i);
        break;
      }
    }
    if (isNaN(parseInt(row)) || col.length === 0) {
      throw new Error("Invalid cell reference");
    }
    return new CellReference(parseInt(row), col);
  }

  // CellReference(1, "A") --> "A1"
  toString(): string {return this.getColumn() + this.getRow();}
  getRow(): number {return this.row;}
  getColumn(): string {return this.column;}
}