// Represents the styling of a cell
export class CellStyle {
  private backgroundColor: Color;

  constructor(backgroundColor: Color) {this.backgroundColor = backgroundColor;}
  getBackgroundColor(): Color {return this.backgroundColor;}
  setBackgroundColor(color: Color) {this.backgroundColor = color;}
}

// Represents a color that can be translated to RGB values
export interface Color {
  getRed(): number;
  getGreen(): number;
  getBlue(): number;
}

// Represents a Color implementation of RGB
export class RGBColor {
  private readonly red: number;
  private readonly green: number;
  private readonly blue: number;

  constructor(red: number, green: number, blue: number) {
    this.red = red;
    this.green = green;
    this.blue = blue;
  }

  getRed(): number {return this.red}
  getGreen(): number {return this.green}
  getBlue(): number {return this.blue;}
}