import React from 'react';
import {POST_TYPE_LINK, POST_TYPE_POLL} from '../../../utils/constants';

const useCalculationContent = () => {
  const [amountLineTopic, setAmountLineTopic] = React.useState(0);
  const [heightTopic, setHeightTopic] = React.useState(0);
  const [heightPoll, setHeightPoll] = React.useState(0);
  const handleCalculation = (
    containerHeight,
    textHeight,
    hugeFont,
    smallFont,
    post_type,
    image
  ) => {
    const diff = containerHeight - textHeight - heightTopic - heightPoll;
    const averageDiff = diff / containerHeight;
    if (containerHeight && textHeight && post_type !== POST_TYPE_POLL && image.length === 0) {
      let font = hugeFont * averageDiff;
      let lineHeight = hugeFont * 1.5 * averageDiff;
      font = Math.ceil(font);
      lineHeight = Math.ceil(lineHeight);
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

  const onPollLayout = ({nativeEvent}) => {
    if (nativeEvent.layout?.height > 0) {
      const height = nativeEvent.layout?.height;
      setHeightPoll(height);
    }
  };

  const handleMarginVertical = (message) => {
    if (message?.length <= 0) {
      return 6;
    }
    return 0;
  };

  return {
    handleCalculation,
    onLayoutTopicChip,
    amountLineTopic,
    heightTopic,
    heightPoll,
    handleMarginVertical,
    onPollLayout
  };
};

export default useCalculationContent;
