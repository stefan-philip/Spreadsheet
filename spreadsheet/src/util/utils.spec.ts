import {columnIndexToLetter, letterToColumnIndex} from "./utils";

it('test columnIndexToLetter errors on 0', () => {
  expect(() => columnIndexToLetter(0)).toThrowError();
});

it('test columnIndexToLetter', () => {
  expect(columnIndexToLetter(1)).toEqual("A");
  expect(columnIndexToLetter(2)).toEqual("B");
  expect(columnIndexToLetter(26)).toEqual("Z");
  expect(columnIndexToLetter(27)).toEqual("AA");
});

it('test letterToColumnIndex', () => {
  expect(letterToColumnIndex("A")).toEqual(1);
  expect(letterToColumnIndex("B")).toEqual(2);
  expect(letterToColumnIndex("Z")).toEqual(26);
  expect(letterToColumnIndex("AA")).toEqual(27);
});