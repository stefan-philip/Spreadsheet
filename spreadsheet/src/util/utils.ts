// Adapted from: https://stackoverflow.com/a/21231012
// 1 : A, 2 : B ...
// Extends to AA, AB...
export function columnIndexToLetter(columnIndex : number) : string {
  if (columnIndex < 1) {
    throw new Error("Invalid column index");
  }
  let temp, letter = '';
  while (columnIndex > 0) {
    temp = (columnIndex - 1) % 26;
    letter = String.fromCharCode(temp + 65) + letter;
    columnIndex = (columnIndex - temp - 1) / 26;
  }
  return letter;
}

// A : 1
export function letterToColumnIndex(letter : string) : number {
  let column = 0, length = letter.length;
  for (let i = 0; i < length; i++) {
    column += (letter.charCodeAt(i) - 64) * Math.pow(26, length - i - 1);
  }
  return column;
}