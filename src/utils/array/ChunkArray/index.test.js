import {joinTopicIntoTopicList} from '.';

describe('joinTopicIntoTopicList should run correctly', () => {
  const topics = ['#ellon', '#apple'];
  it('joinTopicIntoTopicList should run correctly', () => {
    expect(joinTopicIntoTopicList('#microsoft', topics)).toEqual([
      '#ellon',
      '#apple',
      '#microsoft'
    ]);
    expect(joinTopicIntoTopicList('#ellon', topics)).toEqual(['#ellon', '#apple']);
  });
});
