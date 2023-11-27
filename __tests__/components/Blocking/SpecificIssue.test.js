import * as React from 'react';
import renderer from 'react-test-renderer';
import {cleanup, fireEvent, render} from '@testing-library/react-native';

import SpecificIssue from '../../../src/components/Blocking/SpecificIssue';

jest.useFakeTimers();

describe('SpecificIssue Block Component test should pass', () => {
  afterAll(cleanup);
  it('should render', () => {
    const rbSheetOpenRefMock = jest.fn();
    const onPressMock = jest.fn();
    const onSkipMock = jest.fn();
    const loading = false;

    const ref = {
      current: {
        open: rbSheetOpenRefMock
      }
    };

    const tree = renderer
      .create(
        <SpecificIssue
          onPress={onPressMock}
          onSkip={onSkipMock}
          refSpecificIssue={ref}
          loading={loading}
        />
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should render with loading', () => {
    const rbSheetOpenRefMock = jest.fn();
    const onPressMock = jest.fn();
    const onSkipMock = jest.fn();
    const loading = true;

    const ref = {
      current: {
        open: rbSheetOpenRefMock
      }
    };

    const {findByTestId} = render(
      <SpecificIssue
        onPress={onPressMock}
        onSkip={onSkipMock}
        refSpecificIssue={ref}
        loading={loading}
      />
    );
    expect(findByTestId('loading-indicator-test')).toBeTruthy();
  });

  it('should render with loading', async () => {
    const rbSheetOpenRefMock = jest.fn();
    const onPressMock = jest.fn();
    const onSkipMock = jest.fn();
    const loading = true;

    const ref = {
      current: {
        open: rbSheetOpenRefMock
      }
    };
    const realUseState = React.useState;
    const stubInitialState = [''];
    const mockState = jest
      .spyOn(React, 'useState')
      .mockImplementationOnce(() => realUseState(stubInitialState));

    const {getByTestId} = render(
      <SpecificIssue
        onPress={onPressMock}
        onSkip={onSkipMock}
        refSpecificIssue={ref}
        loading={loading}
      />
    );
    await fireEvent.changeText(getByTestId('changeText'));
    await fireEvent.press(getByTestId('button-skip-test'));
    await fireEvent.press(getByTestId('button-report-test'));
    expect(onSkipMock).toHaveBeenCalled();
    expect(onPressMock).toHaveBeenCalled();
  });
});
