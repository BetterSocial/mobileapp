import {POST_TYPE_LINK, POST_TYPE_POLL} from '../../../utils/constants';

const useCalculationContent = () => {
  const handleCalculation = (
    containerHeight,
    textHeight,
    hugeFont,
    smallFont,
    post_type,
    image,
    message
  ) => {
    const diff = containerHeight - textHeight;
    const averageDiff = diff / containerHeight;
    let readMore = false;
    if (averageDiff < 0.05) {
      readMore = true;
    }
    if (
      containerHeight &&
      textHeight &&
      post_type !== POST_TYPE_POLL &&
      post_type !== POST_TYPE_LINK &&
      image.length === 0
    ) {
      console.log(
        {containerHeight, textHeight, message, diff, averageDiff, length: message.length, readMore},
        'angkah'
      );

      let font = hugeFont * averageDiff;
      let lineHeight = hugeFont * 1.5 * averageDiff;

      if (font < smallFont) {
        font = smallFont;
        lineHeight = smallFont * 1.5;
      }
      return {
        font,
        lineHeight,
        readMore
      };
    }
    return {
      font: smallFont,
      lineHeight: smallFont * 1.5,
      readMore
    };
  };
  return {
    handleCalculation
  };
};

export default useCalculationContent;
