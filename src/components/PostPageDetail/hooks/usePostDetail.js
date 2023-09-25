/* eslint-disable operator-assignment */
import {Dimensions, StatusBar} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {normalizeFontSizeByWidth} from '../../../utils/fonts';

const usePostDetail = () => {
  const longTextFontSize = normalizeFontSizeByWidth(16);
  const longTextLineHeight = normalizeFontSizeByWidth(24);
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

  const calculatedSizeScreen = top + bottom + StatusBar.currentHeight + 170;

  const calculationText = (message) => {
    if (!message) message = '';
    let fontSize = shortTextFontSize;
    let lineHeight = shortTextLineHeight;
    let isShortText = false;
    let containerHeight = 0;
    if (message?.length > 270) {
      fontSize = longTextFontSize;
      lineHeight = longTextLineHeight;
    } else {
      fontSize = shortTextFontSize;
      lineHeight = shortTextLineHeight;
    }
    const numLines = 0.5;

    const numberOfLines = Math.ceil(
      message?.length / ((Dimensions.get('window').width / fontSize) * numLines)
    );
    containerHeight = numberOfLines * lineHeight;
    containerHeight = Math.max(containerHeight, shortTextLineHeight * 5);
    containerHeight = containerHeight * 0.5;
    if (containerHeight < normalizeFontSizeByWidth(325)) {
      containerHeight = normalizeFontSizeByWidth(325);
      isShortText = true;
    }
    const containerComment = calculatedSizeScreen - containerHeight;
    return {fontSize, lineHeight, containerHeight, containerComment, isShortText};
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
