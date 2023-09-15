import {renderHook} from '@testing-library/react-hooks';
import useCalculationContentLink from '../../src/screens/FeedScreen/hooks/useCalculatiuonContentLink';

describe('useCalculationContentLink should run correctly', () => {
  it('handleTextHeight should run correctly', async () => {
    const {result} = renderHook(useCalculationContentLink);
    await result.current.handleTextHeight({nativeEvent: {layout: {height: 100}}});
    expect(result.current.textHeight).toEqual(100);
  });
  it('handleTopicLayout should run correctly', async () => {
    const {result} = renderHook(useCalculationContentLink);
    await result.current.handleTopicLayout({layout: {height: 50}});
    expect(result.current.heightTopic).toEqual(50);
  });
});
