import {Dimensions, StatusBar} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {POST_TYPE_LINK, POST_TYPE_POLL} from '../../../utils/constants';
import {normalizeFontSize} from '../../../utils/fonts';

const usePostDetail = () => {
  let longTextFontSize = normalizeFontSize(16);
  let longTextLineHeight = normalizeFontSize(24);
  const shortTextFontSize = normalizeFontSize(24);
  const shortTextLineHeight = normalizeFontSize(44);
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

  const calculationText = (
    message,
    post_type,
    image,
    shortTextSize = shortTextFontSize,
    shortTextLineH = shortTextLineHeight,
    messageLength = 270,
    isFeed
  ) => {
    if (!message) message = '';
    let fontSize = shortTextSize;
    let lineHeight = shortTextLineHeight;
    let line = message?.length / messageLength;
    let defaultNumberLine = 5;
    if (line < 1) {
      line = 1;
    } else {
      // line += 0.3;
    }
    let containerHeight = 0;
    if (message?.length > messageLength) {
      if (!isFeed) {
        fontSize = longTextFontSize;
        lineHeight = longTextLineHeight;
      } else {
        longTextFontSize = normalizeFontSize(20);
        longTextLineHeight = normalizeFontSize(30);
        fontSize = (1 / line) * shortTextSize;
        lineHeight = (1 / line) * shortTextLineH;
        if (
          fontSize < longTextFontSize &&
          (post_type === POST_TYPE_POLL || post_type === POST_TYPE_LINK || image?.length > 0)
        ) {
          fontSize = longTextFontSize;
          lineHeight = longTextLineHeight;
        } else {
          fontSize = shortTextFontSize * 0.6;
          lineHeight = shortTextLineHeight * 0.6;
          defaultNumberLine = 10;
        }
      }
    } else {
      fontSize = (1 / line) * shortTextSize;
      lineHeight = (1 / line) * shortTextLineH;
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
    return {fontSize, lineHeight, containerHeight, containerComment, defaultNumberLine};
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
