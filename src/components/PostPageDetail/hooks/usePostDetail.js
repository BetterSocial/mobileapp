import {Dimensions, StatusBar} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {POST_TYPE_LINK, POST_TYPE_POLL} from '../../../utils/constants';

const usePostDetail = () => {
  const longTextFontSize = 16;
  const longTextLineHeight = 24;
  const shortTextFontSize = 24;
  const shortTextLineHeight = 44;
  const {top, bottom} = useSafeAreaInsets();
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

  const calculationText = (message, post_type, image) => {
    if (!message) message = '';
    let fontSize = shortTextFontSize;
    let lineHeight = shortTextLineHeight;
    let containerHeight = 0;
    if (message?.length > 270) {
      fontSize = longTextFontSize;
      lineHeight = longTextLineHeight;
    } else {
      fontSize = shortTextFontSize;
      lineHeight = shortTextLineHeight;
    }
    const numLines = 0.5;
    const messageLength = (message || '').length;
    const widthDimension = Dimensions.get('window').width;

    const numberOfLines = Math.ceil(messageLength / ((widthDimension / fontSize) * numLines));

    containerHeight = numberOfLines * lineHeight;
    containerHeight = Math.max(containerHeight, shortTextLineHeight * 5);
    if (image?.length > 0 || post_type === POST_TYPE_POLL) {
      containerHeight *= 1.8;
    }
    if (post_type === POST_TYPE_LINK) {
      containerHeight *= 2;
    }
    const containerComment = calculatedSizeScreen - containerHeight;
    return {fontSize, lineHeight, containerHeight, containerComment};
  };

  const calculatedSizeScreen = top + bottom + StatusBar.currentHeight + 170;

  const calculatePaddingBtm = () => {
    let defaultValue = 108;
    if (top > 20) {
      defaultValue = 170;
    }
    return calculatedSizeScreen - defaultValue;
  };

  return {
    updateVoteLatestChildrenLevel3,
    updateVoteChildrenLevel1,
    calculationText,
    calculatedSizeScreen,
    calculatePaddingBtm
  };
};

export default usePostDetail;
