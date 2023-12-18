export const joinTopicIntoTopicList = (newTopic = '', topics = []) => {
  if (!topics?.includes(newTopic)) return [...topics, newTopic];
  return topics;
};
