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

const getCountCommentWithChild = (item) => {
  // console.log('item');
  // console.log(JSON.stringify(item));
  let count = 0;
  let reactionCountLevelOne = item.reaction_counts;
  let reactionLevelOne = item.latest_reactions.comment;
  if (JSON.stringify(reactionCountLevelOne) !== '{}') {
    let comment = reactionCountLevelOne.comment;
    if (comment !== undefined) {
      count += comment;
    }

    reactionLevelOne.forEach((itemLevelOne) => {
      if (JSON.stringify(itemLevelOne.latest_children) !== '{}') {
        console.log('itemLevelOne.latest_children');
        console.log(itemLevelOne.latest_children);
        let reactionLevelTwo = itemLevelOne.latest_children.comment;
        reactionLevelTwo.forEach((itemLevelTwo, index) => {
          count += reactionLevelTwo.length;

          let reactionLevelThree = itemLevelTwo.latest_children;
          if (JSON.stringify(reactionLevelThree) !== '{}') {
            count += reactionLevelThree.comment.length;
          }
        });
      }
    });
  }

  return count;
};

const getCountCommentWithChildInDetailPage = (item) => {
  let count = 0;
  let reactionCountLevelOne = item.comment;
  count += item.comment.length;
  reactionCountLevelOne.forEach((itemLevelOne, index) => {
    if (JSON.stringify(itemLevelOne.children_counts) !== '{}') {
      let reactionLevelTwo = itemLevelOne.latest_children.comment;
      count += reactionLevelTwo.length;
      reactionLevelTwo.forEach((itemLevelTwo, index) => {
        // if (JSON.stringify(itemLevelTwo.children_counts) !== '{}') {
        //   count += itemLevelTwo.children_counts.comment;
        // }
        let reactionLevelThree = itemLevelTwo.latest_children;
        if (JSON.stringify(reactionLevelThree) !== '{}') {
          count += reactionLevelThree.comment.length;
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
};
