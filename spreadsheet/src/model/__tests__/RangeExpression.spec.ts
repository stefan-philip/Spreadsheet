import {RangeExpression} from "../RangeExpression";
import {CellReference} from "../CellReference";

it('getters work for normal range', () => {
  let a1 = new CellReference(1, "A");
  let b5 = new CellReference(5, "B")
  let range = new RangeExpression(a1, b5)
  expect(range.getStartRef()).toEqual(a1);
  expect(range.getEndRef()).toEqual(b5);
});

it('getters work for same start/end range', () => {
  let a1 = new CellReference(1, "A");
  let range = new RangeExpression(a1, a1)
  expect(range.getStartRef()).toEqual(a1);
  expect(range.getEndRef()).toEqual(a1);
});

it('getters work for range expression factory method', () => {
  let a1 = new CellReference(1, "A");
  let b5 = new CellReference(5, "B")
  let range = RangeExpression.createRangeExpression("A1..B5");
  expect(range.getStartRef()).toEqual(a1);
  expect(range.getEndRef()).toEqual(b5);
});
