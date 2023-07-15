export const ChunkArray = (arr, size) => {
  const myArray = [];
  for (let i = 0; i < arr.length; i += size) {
    myArray.push(arr.slice(i, i + size));
  }
  return myArray;
};

export const joinTopicIntoTopicList = (newTopic = '', topics = []) => {
  if (!topics?.includes(newTopic)) return [...topics, newTopic];
  return topics;
};
