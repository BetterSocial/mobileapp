import * as React from 'react';
import {render, cleanup, fireEvent} from '@testing-library/react-native';
import Footer from '../../../src/components/Footer/Footer';
import {Context} from '../../../src/context';
import {myProfileMock} from '../../../__mocks__/mockMyProfile';

describe('Footer should run correctly', () => {
  const wrapper = ({children}) => (
    <Context.Provider
      value={{
        profile: [
          {isShowHeader: true, myProfile: myProfileMock, navbarTitle: "Who you're following"}
        ]
      }}>
      {children}
    </Context.Provider>
  );

  afterEach(cleanup);
  it('should match snapshot', () => {
    const onPressShare = jest.fn();
    const onPressDownVote = jest.fn();
    const onPressUpvote = jest.fn();
    const onPressBlock = jest.fn();
    const onPressComment = jest.fn();
    const {toJSON, getByTestId, getAllByTestId} = render(
      <Footer
        totalComment={10}
        onPressComment={onPressComment}
        onPressBlock={onPressBlock}
        onPressDownVote={onPressDownVote}
        onPressUpvote={onPressUpvote}
        blockStatus={{blocker: null}}
        loadingVote={false}
        disableComment={false}
        totalVote={5}
        isSelf={false}
        onPressShare={onPressShare}
        statusVote={'none'}
      />,
      {wrapper}
    );
    expect(toJSON).toMatchSnapshot();
    expect(getAllByTestId('onPressBlock')).toHaveLength(1);
    expect(getAllByTestId('availableComment')).toHaveLength(1);
    fireEvent.press(getByTestId('onPressBlock'));
    expect(onPressBlock).toHaveBeenCalled();
    const {getAllByTestId: getIsSelf} = render(
      <Footer
        totalComment={10}
        onPressComment={onPressComment}
        onPressBlock={onPressBlock}
        onPressDownVote={onPressDownVote}
        onPressUpvote={onPressUpvote}
        blockStatus={{blocker: null}}
        loadingVote={false}
        disableComment={false}
        totalVote={5}
        isSelf={true}
        onPressShare={onPressShare}
        statusVote={'none'}
      />,
      {wrapper}
    );
    expect(getIsSelf('isself')).toHaveLength(1);
    const {getAllByTestId: getIsBlock} = render(
      <Footer
        totalComment={10}
        onPressComment={onPressComment}
        onPressBlock={onPressBlock}
        onPressDownVote={onPressDownVote}
        onPressUpvote={onPressUpvote}
        blockStatus={{blocker: true}}
        loadingVote={false}
        disableComment={true}
        totalVote={5}
        isSelf={false}
        onPressShare={onPressShare}
        statusVote={'none'}
      />,
      {wrapper}
    );
    expect(getIsBlock('blocker')).toHaveLength(1);
    expect(getIsBlock('disableComment')).toHaveLength(1);
  });
});
