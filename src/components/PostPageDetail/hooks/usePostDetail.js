import {normalizeFontSize} from '../../../utils/fonts';

const usePostDetail = () => {
  const updateVoteLatestChildrenLevel3 = (commentList, dataUpdated) => {
    const updateComment = commentList.map((comment) => {
      if (comment.activity_id === dataUpdated.activity_id) {
        const latestChildrenMap = comment.latest_children.comment.map((com) => {
          if (com.id === dataUpdated.parent) {
            const mappingChildren2 = com.latest_children.comment.map((com1) => {
              if (com1.id === dataUpdated.id) {
                return {...com1, data: dataUpdated.data};
              }
              return {...com1};
            });
            return {...com, latest_children: {comment: mappingChildren2}};
          }
          return {...com};
        });
        return {...comment, latest_children: {comment: latestChildrenMap}};
      }
      return {...comment};
    });
    return updateComment;
  };

  const updateVoteChildrenLevel1 = (commentList, dataUpdated) => {
    const newComment = commentList.map((myComment) => {
      if (myComment.id === dataUpdated.parent) {
        const newChild = myComment.latest_children.comment.map((child) => {
          if (child.id === dataUpdated.id) {
            return {...child, data: dataUpdated.data};
          }
          return {...child};
        });
        return {...myComment, latest_children: {comment: newChild}};
      }
      return {...myComment};
    });
    return newComment;
  };

  const calculationText = (message) => {
    const smallText = 16;
    const hugeText = smallText + smallText * 0.6;
    const smallLineHeight = 26;
    const hugeLineHeight = smallLineHeight + smallLineHeight * 0.8;
    if (message?.length > 270) {
      return {
        fontSize: normalizeFontSize(smallText),
        lineHeight: smallLineHeight
      };
    }
    return {
      fontSize: normalizeFontSize(hugeText),
      lineHeight: hugeLineHeight
    };
  };

  return {updateVoteLatestChildrenLevel3, updateVoteChildrenLevel1, calculationText};
};

export default usePostDetail;
