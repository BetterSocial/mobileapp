import {joinTopicIntoTopicList} from '../../src/utils/array/ChunkArray';

describe('chunk array should run correctly', () => {
  it('joinTopicIntoTopicList should run correctly', () => {
    expect(joinTopicIntoTopicList('baru', [])).toEqual(['baru']);
    expect(joinTopicIntoTopicList('baru', ['baru'])).toEqual(['baru']);
  });
});
