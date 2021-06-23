import {ChunkArray} from './index';
it('test array chunk', () => {
  expect(ChunkArray([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]]);
});
