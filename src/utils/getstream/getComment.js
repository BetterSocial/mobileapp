export const getComment = async ({feed, level, idlevel1, idlevel2}) => {
  if (level === 0) {
    let newData = await feed?.latest_reactions?.comment.find(
      (item) => item.id === idlevel1,
    );
    return newData;
  }
  if (level > 0) {
    let newData = await feed?.latest_reactions?.comment.find(
      (item) => item.id === idlevel2,
    );
    let newDataChild = await newData?.latest_children?.comment.find(
      (item) => item.id === idlevel1,
    );
    return newDataChild;
  }
  return null;
};
