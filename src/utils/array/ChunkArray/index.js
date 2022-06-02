export const ChunkArray = (arr, size) => {
  var myArray = [];
  for (var i = 0; i < arr.length; i += size) {
    myArray.push(arr.slice(i, i + size));
  }
  return myArray;
};

export const chunkArrayCustom = (perChunk = 2, inputArray = []) => {
  var result = inputArray.reduce((resultArray, item, index) => { 
    const chunkIndex = index % perChunk

    if(!resultArray[chunkIndex]) {
      resultArray[chunkIndex] = []; // start a new chunk
    }
    resultArray[chunkIndex].push(item);
    return resultArray;
  }, []);
  return result
};