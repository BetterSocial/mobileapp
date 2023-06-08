import {ChunkArray, joinTopicIntoTopicList} from '../../src/utils/array/ChunkArray';

describe('chunk array should run correctly', () => {
  it('Chunk Array should run correctly', () => {
    expect(ChunkArray([10, 20, 30], 2)).toEqual([[10, 20], [30]]);
    expect(ChunkArray([])).toEqual([]);
  });

  it('joinTopicIntoTopicList should run correctly', () => {
    expect(joinTopicIntoTopicList('baru', [])).toEqual(['baru']);
    expect(joinTopicIntoTopicList('baru', ['baru'])).toEqual(['baru']);
  });
});
