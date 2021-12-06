import {CellReference} from "../CellReference";

it('getters work for A1', () => {
  let ref = new CellReference(1, "A")
  expect(ref.getRow()).toEqual(1);
  expect(ref.getColumn()).toEqual("A");
});

it('getters work for AA1', () => {
  let ref = new CellReference(1, "AA")
  expect(ref.getRow()).toEqual(1);
  expect(ref.getColumn()).toEqual("AA");
});

it('getters work for AA1', () => {
  let ref = new CellReference(1, "AA")
  expect(ref.getRow()).toEqual(1);
  expect(ref.getColumn()).toEqual("AA");
});

it('toString test', () => {
  let ref = new CellReference(1, "A")
  expect(ref.toString()).toEqual("A1");
});


it('toString test', () => {
  let ref = new CellReference(100, "B")
  expect(ref.toString()).toEqual("B100");
});

it('cellreference factory method', () => {
  let ref = CellReference.createCellReference("A1");
  expect(ref.toString()).toEqual("A1");
  expect(ref.getRow()).toEqual(1);
  expect(ref.getColumn()).toEqual("A");
});