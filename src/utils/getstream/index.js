const getCountVote = (item) => {
  const reactionCount = item?.reaction_counts;
  let count = 0;
  if (JSON.stringify(reactionCount) !== '{}') {
    const upvote = reactionCount?.upvotes;
    if (upvote !== undefined) {
      count += upvote;
    }
    const downvote = reactionCount?.downvotes;
    if (downvote !== undefined) {
      count -= downvote;
    }
  }
  return count;
};

const getCountComment = (item) => {
  const reactionCount = item?.reaction_counts;
  let count = 0;
  if (JSON.stringify(reactionCount) !== '{}') {
    const {comment} = reactionCount;
    if (comment !== undefined) {
      count = comment;
    }
  }
  return count;
};

const getCountCommentWithChild = (item) => {
  let count = 0;
  const reactionCountLevelOne = item?.reaction_counts;
  const reactionLevelOne = item?.latest_reactions?.comment || [];

  if (JSON.stringify(reactionCountLevelOne) !== '{}') {
    const {comment} = reactionCountLevelOne || {};
    if (comment !== undefined) {
      count += comment;
    }

    try {
      reactionLevelOne.forEach((itemLevelOne) => {
        if (JSON.stringify(itemLevelOne.latest_children) !== '{}') {
          const reactionLevelTwo = itemLevelOne.latest_children.comment;
          reactionLevelTwo.forEach((itemLevelTwo) => {
            count += reactionLevelTwo.length;

            const reactionLevelThree = itemLevelTwo.latest_children;
            if (JSON.stringify(reactionLevelThree) !== '{}') {
              count += reactionLevelThree.comment.length;
            }
          });
        }
      });
    } catch (e) {
      console.log(e);
    }
  }

  return count;
};

const getCommentLength = (comments) => {
  let commentLength = 0;
  if (comments && Array.isArray(comments)) {
    commentLength = comments?.length;
  }
  return commentLength;
};

const getCountCommentWithChildInDetailPage = (item) => {
  let count = 0;
  const reactionCountLevelOne = item?.comment || [];
  count += item?.comment?.length || 0;
  reactionCountLevelOne.forEach((itemLevelOne) => {
    if (itemLevelOne?.latest_children?.comment !== undefined) {
      const reactionLevelTwo = itemLevelOne?.latest_children?.comment || [];
      count += reactionLevelTwo.length;
      reactionLevelTwo.forEach((itemLevelTwo) => {
        const reactionLevelThree = itemLevelTwo?.latest_children;
        if (JSON.stringify(reactionLevelThree) !== '{}') {
          count += reactionLevelThree?.comment?.length || 0;
        }
      });
    }
  });

  return count;
};
export {
  getCountComment,
  getCountVote,
  getCountCommentWithChild,
  getCountCommentWithChildInDetailPage,
  getCommentLength
};
