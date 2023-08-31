import {act, renderHook} from '@testing-library/react-hooks';
import useCalculationContent from '../../src/screens/FeedScreen/hooks/useCalculationContent';
import {POST_TYPE_POLL, POST_TYPE_STANDARD} from '../../src/utils/constants';

describe('useCalculationContent should run correctly', () => {
  it('handleCalculation should run correctly', () => {
    const {result} = renderHook(useCalculationContent);
    expect(result.current.handleCalculation(499, 150, 28, 16, POST_TYPE_STANDARD, []).font).toEqual(
      20
    );
    expect(
      result.current.handleCalculation(499, 150, 28, 16, POST_TYPE_STANDARD, []).lineHeight
    ).toEqual(30);
    expect(result.current.handleCalculation(499, 150, 28, 16, POST_TYPE_POLL, []).font).toEqual(16);
    expect(
      result.current.handleCalculation(499, 150, 28, 16, POST_TYPE_POLL, []).lineHeight
    ).toEqual(24);
    expect(
      result.current.handleCalculation(499, 150, 28, 16, POST_TYPE_STANDARD, ['https://gambar.com'])
        .font
    ).toEqual(16);
    expect(
      result.current.handleCalculation(499, 150, 28, 16, POST_TYPE_STANDARD, ['https://gambar.com'])
        .lineHeight
    ).toEqual(24);
    expect(result.current.handleCalculation(499, 498, 28, 16, POST_TYPE_STANDARD, []).font).toEqual(
      16
    );
    expect(
      result.current.handleCalculation(499, 498, 28, 16, POST_TYPE_STANDARD, []).lineHeight
    ).toEqual(24);
  });
  it('getLayoutTopic shuld run correctly', () => {
    const {result} = renderHook(useCalculationContent);
    act(() => {
      result.current.onLayoutTopicChip({layout: {height: 30}}, 15);
    });
    expect(result.current.amountLineTopic).toEqual(2);
    expect(result.current.heightTopic).toEqual(30);
  });
});

// import React from 'react';
// import {POST_TYPE_LINK, POST_TYPE_POLL} from '../../../utils/constants';

// const useCalculationContent = () => {
//   const [amountLineTopic, setAmountLineTopic] = React.useState(0);
//   const [heightTopic, setHeightTopic] = React.useState(0);
//   const handleCalculation = (
//     containerHeight,
//     textHeight,
//     hugeFont,
//     smallFont,
//     post_type,
//     image
//   ) => {
//     const diff = containerHeight - textHeight - heightTopic;
//     const averageDiff = diff / containerHeight;
//     if (
//       containerHeight &&
//       textHeight &&
//       post_type !== POST_TYPE_POLL &&
//       post_type !== POST_TYPE_LINK &&
//       image.length === 0
//     ) {
//       let font = hugeFont * averageDiff;
//       let lineHeight = hugeFont * 1.5 * averageDiff;
//       font = Math.ceil(font);
//       lineHeight = Math.ceil(lineHeight);
//       if (font < smallFont) {
//         font = smallFont;
//         lineHeight = smallFont * 1.5;
//       }

//       return {
//         font,
//         lineHeight
//       };
//     }
//     return {
//       font: smallFont,
//       lineHeight: smallFont * 1.5
//     };
//   };

//   const getLayoutTopic = (height, lineHeight) => {
//     if (height && height > 0 && lineHeight > 0) {
//       const amountLine = Math.ceil(height / lineHeight);
//       setAmountLineTopic(amountLine);
//       setHeightTopic(height);
//     }
//   };
//   const onLayoutTopicChip = (nativeEvent, lineHeight) => {
//     getLayoutTopic(nativeEvent.layout?.height, lineHeight);
//   };

//   return {
//     handleCalculation,
//     onLayoutTopicChip,
//     amountLineTopic,
//     heightTopic
//   };
// };

// export default useCalculationContent;
