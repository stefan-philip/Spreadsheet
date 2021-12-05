// Represents a position of a cell (numeric row and alphabetic column)
export class CellReference {
  private row: number;
  private column: string;

  constructor(row: number, column: string) {
    this.row = row;
    this.column = column;
  }

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

  toString(): string {
    return this.getColumn() + this.getRow();
  }

  getRow(): number {
    return this.row;
  }

  getColumn(): string {
    return this.column;
  }

}