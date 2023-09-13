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
