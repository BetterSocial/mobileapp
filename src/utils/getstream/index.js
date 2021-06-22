const getCountVote = (item) => {
  let reactionCount = item.reaction_counts;
  let count = 0;
  if (JSON.stringify(reactionCount) !== '{}') {
    let upvote = reactionCount.upvotes;
    if (upvote !== undefined) {
      count = count + upvote;
    }
    let downvote = reactionCount.downvotes;
    if (downvote !== undefined) {
      count = count - downvote;
    }
  }
  return count;
};

const getCountComment = (item) => {
  let reactionCount = item.reaction_counts;
  let count = 0;
  if (JSON.stringify(reactionCount) !== '{}') {
    let comment = reactionCount.comment;
    if (comment !== undefined) {
      count = comment;
    }
  }
  return count;
};

export {getCountComment, getCountVote};
