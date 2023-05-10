import * as React from 'react';
import renderer from 'react-test-renderer';
import {fireEvent, render} from '@testing-library/react-native';

import TaggingUserText from '../../../src/components/TaggingUserText';
import {getUserId} from '../../../src/utils/token';

jest.mock('../../../src/utils/token');

let navigation;

describe('TaggingUserText component test', () => {
  beforeEach(() => {
    navigation = {
      push: jest.fn()
    };
  });

  it('should render and match snapshot', () => {
    const toJSON = renderer.create(<TaggingUserText text="@fajarism" />).toJSON();
    expect(toJSON).toMatchSnapshot();
  });

  it('should not navigate if navigation is null', async () => {
    getUserId.mockResolvedValue('1');

    await Promise.resolve();

    const {getByTestId} = render(<TaggingUserText text="@fajarism" navigation={navigation} />);
    const component = getByTestId('TaggingUserTextComponent');
    fireEvent.press(component);

    expect(navigation.push).not.toHaveBeenCalled();
  });

  it('should navigate to OtherProfile screen', async () => {
    getUserId.mockResolvedValue('1');

    const {getByTestId} = render(<TaggingUserText text="@fajarism" navigation={navigation} />);
    const component = getByTestId('TaggingUserTextComponent');
    fireEvent.press(component);

    await Promise.resolve();

    expect(navigation.push).toHaveBeenCalledWith('OtherProfile', {
      data: {
        user_id: '1',
        other_id: null,
        username: 'fajarism'
      }
    });
  });

  it('should not navigate if currentTopic is equal to text', async () => {
    getUserId.mockResolvedValue('1');

    await Promise.resolve();

    const {getByTestId} = render(
      <TaggingUserText text="@fajarism" navigation={navigation} currentTopic={'fajarism'} />
    );
    const component = getByTestId('TaggingUserTextComponent');
    fireEvent.press(component);

    expect(navigation.push).not.toHaveBeenCalled();
  });
});
