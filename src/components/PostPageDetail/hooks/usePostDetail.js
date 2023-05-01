import {Dimensions} from 'react-native';
import {normalizeFontSize} from '../../../utils/fonts';

const usePostDetail = () => {
  const longTextFontSize = 16;
  const longTextLineHeight = 24;
  const shortTextFontSize = 24;
  const shortTextLineHeight = 44;
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
    let fontSize = normalizeFontSize(shortTextFontSize);
    let lineHeight = shortTextLineHeight;
    let containerHeight = 0;
    if (message.length > 270) {
      fontSize = normalizeFontSize(longTextFontSize);
      lineHeight = longTextLineHeight;
    } else {
      fontSize = normalizeFontSize(shortTextFontSize);
      lineHeight = shortTextLineHeight;
    }

    const numberOfLines = Math.ceil(
      message.length / ((Dimensions.get('window').width / fontSize) * 0.5)
    );

    containerHeight = numberOfLines * lineHeight;

    containerHeight = Math.max(containerHeight, shortTextLineHeight * 3);

    return {fontSize, lineHeight, containerHeight};
  };

  return {updateVoteLatestChildrenLevel3, updateVoteChildrenLevel1, calculationText};
};

export default usePostDetail;
