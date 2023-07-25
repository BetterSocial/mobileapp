import {Dimensions, StatusBar} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {POST_TYPE_LINK, POST_TYPE_POLL} from '../../../utils/constants';
import {normalizeFontSizeByWidth} from '../../../utils/fonts';

const usePostDetail = () => {
  let longTextFontSize = normalizeFontSizeByWidth(16);
  let longTextLineHeight = normalizeFontSizeByWidth(24);
  const shortTextFontSize = normalizeFontSizeByWidth(24);
  const shortTextLineHeight = normalizeFontSizeByWidth(44);
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

  const handleText = ({
    message,
    post_type,
    image,
    shortTextSize,
    shortTextLineH,
    messageLength,
    isFeed
  }) => {
    let fontSize = shortTextSize;
    let lineHeight = shortTextLineHeight;
    let line = message?.length / messageLength;
    console.log({line, message}, 'line');
    let defaultNumberLine = 5;
    if (line < 1) line = 1;
    if (message?.length > messageLength) {
      if (!isFeed) {
        fontSize = longTextFontSize;
        lineHeight = longTextLineHeight;
      } else {
        longTextFontSize = normalizeFontSizeByWidth(16);
        longTextLineHeight = normalizeFontSizeByWidth(24);
        fontSize = (1 / line) * shortTextSize;
        if (post_type === POST_TYPE_POLL || post_type === POST_TYPE_LINK || image?.length > 0) {
          if (fontSize < longTextFontSize) {
            fontSize = longTextFontSize;
            lineHeight = longTextLineHeight;
            // defaultNumberLine = 4;
          } else {
            fontSize = shortTextFontSize * 0.6;
            lineHeight = shortTextLineHeight * 0.6;
            // defaultNumberLine = 5;
          }
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
    return {fontSize, lineHeight, defaultNumberLine};
  };

  const calculatedSizeScreen = top + bottom + StatusBar.currentHeight + 170;

  const calculationText = (
    message,
    post_type,
    image,
    shortTextSize,
    shortTextLineH,
    messageLength,
    isFeed
  ) => {
    if (!message) message = '';
    if (!shortTextSize) shortTextSize = shortTextFontSize;
    if (!shortTextLineH) shortTextLineH = shortTextLineHeight;
    if (!messageLength) messageLength = 270;
    let containerHeight = 0;
    const {fontSize, lineHeight, defaultNumberLine} = handleText({
      message,
      post_type,
      image,
      shortTextSize,
      shortTextLineH,
      messageLength,
      isFeed
    });
    const numLines = 0.5;
    const widthDimension = Dimensions.get('window').width;
    const numberOfLines = Math.ceil(message?.length / ((widthDimension / fontSize) * numLines));
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
