export const ChunkArray = (arr, size) => {
    const myArray = [];
    for (let i = 0; i < arr.length; i += size) {
        myArray.push(arr.slice(i, i + size));
    }
    return myArray;
};

export const chunkArrayCustom = (perChunk = 2, inputArray = []) => {
    const result = inputArray.reduce((resultArray, item, index) => {
        const chunkIndex = index % perChunk

        if (!resultArray[chunkIndex]) {
            resultArray[chunkIndex] = []; // start a new chunk
        }
        resultArray[chunkIndex].push(item);
        return resultArray;
    }, []);
    return result
};

export const insertNewTopicIntoTopics = (newTopic, topics, setListTopic, setHashtags) => {
    if (!topics.includes(newTopic)) {
        const newArr = [...topics, newTopic];
        setListTopic(newArr);
        setHashtags(newArr)
    }
}

export const joinTopicIntoTopicList = (newTopic = '', topics = []) => {
    if (!topics?.includes(newTopic)) return [...topics, newTopic]
    return topics
}