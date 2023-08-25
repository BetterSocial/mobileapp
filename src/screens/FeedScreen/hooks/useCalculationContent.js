import React from 'react';
import {POST_TYPE_LINK, POST_TYPE_POLL} from '../../../utils/constants';
import {normalizeFontSizeByWidth} from '../../../utils/fonts';

const useCalculationContent = () => {
  const maxFontSize = normalizeFontSizeByWidth(28);
  const minFontSize = normalizeFontSizeByWidth(16);
  const [amountLineTopic, setAmountLineTopic] = React.useState(0);
  const [heightTopic, setHeightTopic] = React.useState(0);
  const handleCalculation = (
    containerHeight,
    textHeight,
    hugeFont = maxFontSize,
    smallFont = minFontSize,
    post_type,
    image
  ) => {
    const diff = containerHeight - textHeight - heightTopic;
    const averageDiff = diff / containerHeight;
    if (
      containerHeight &&
      textHeight &&
      post_type !== POST_TYPE_POLL &&
      post_type !== POST_TYPE_LINK &&
      image.length === 0
    ) {
      let font = hugeFont * averageDiff;
      let lineHeight = hugeFont * 1.5 * averageDiff;

      if (font < smallFont) {
        font = smallFont;
        lineHeight = smallFont * 1.5;
      }
      return {
        font,
        lineHeight
      };
    }
    return {
      font: smallFont,
      lineHeight: smallFont * 1.5
    };
  };

  const getLayoutTopic = (height, lineHeight) => {
    if (height && height > 0 && lineHeight > 0) {
      const amountLine = Math.ceil(height / lineHeight);
      setAmountLineTopic(amountLine);
      setHeightTopic(height);
    }
  };
  const onLayoutTopicChip = (nativeEvent, lineHeight) => {
    getLayoutTopic(nativeEvent.layout?.height, lineHeight);
  };

  return {
    handleCalculation,
    onLayoutTopicChip,
    amountLineTopic,
    heightTopic
  };
};

export default useCalculationContent;
