import {act, renderHook} from '@testing-library/react-hooks';
import useReadmore from '../../src/components/ReadMore/hooks/useReadmore';

describe('useReadmore hooks should run correctly', () => {
  it('handleLayoutText shsould run correctly', async () => {
    const {result} = renderHook(() => useReadmore({numberLine: 2}));
    await result.current.setLayoutWidth(200);
    await result.current.handleLayoutText({
      nativeEvent: {
        lines: [
          {
            text: 'Belanda sebagai hub impor Eropa hanya mengimpor 1,75 juta ton yakni Australia.',
            width: 200
          },
          {
            text: 'pada Juni, turun 50% dibandingkan pada Mei. Pelemahan impor negara Eropa',
            width: 200
          },
          {
            text: 'ini sangat berdampak kepada negara pemasok batu',
            width: 190
          },
          {text: 'yakni Australia.', width: 100}
        ]
      }
    });
    expect(result.current.textShown).toEqual(
      'Belanda sebagai hub impor Eropa hanya mengimpor 1,75 juta ton yakni Australia. turun 50% dibandingkan pada Mei. Pelemahan impor negara Eropa'
    );
    expect(result.current.realNumberLine).toEqual(4);
    expect(result.current.isFinishSetLayout).toBeTruthy();
  });

  it('handleLayout sshould run correctly', () => {
    const {result} = renderHook(() => useReadmore({numberLine: 2}));
    act(() => {
      result.current.handleLayoutWidth({nativeEvent: {layout: {width: 200.2456789}}});
    });
    expect(result.current.layoutWidth).toEqual(200);
  });
});
