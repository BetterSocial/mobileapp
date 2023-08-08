import {POST_TYPE_LINK, POST_TYPE_POLL} from '../../../utils/constants';

const useCalculationContent = () => {
  const handleCalculation = (
    containerHeight,
    textHeight,
    hugeFont,
    smallFont,
    post_type,
    image
  ) => {
    const diff = containerHeight - textHeight;
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
  return {
    handleCalculation
  };
};

export default useCalculationContent;
