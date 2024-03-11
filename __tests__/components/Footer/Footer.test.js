import * as React from 'react';
import {cleanup, fireEvent, render} from '@testing-library/react-native';

import Footer from '../../../src/components/Footer/Footer';
import {Context} from '../../../src/context';

describe('Footer should run correctly', () => {
  afterEach(cleanup);
  it('should match snapshot', () => {
    const onPressShare = jest.fn();
    const onPressDownVote = jest.fn();
    const onPressUpvote = jest.fn();
    const onPressBlock = jest.fn();
    const onPressComment = jest.fn();
    const contextValue = {
      profile: [{}, jest.fn()]
    };

    const {toJSON, getByTestId, getAllByTestId} = render(
      <Context.Provider value={contextValue}>
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
        />
      </Context.Provider>
    );
    expect(toJSON).toMatchSnapshot();
    expect(getAllByTestId('onPressBlock')).toHaveLength(1);
    expect(getAllByTestId('availableComment')).toHaveLength(1);
    fireEvent.press(getByTestId('onPressBlock'));
    expect(onPressBlock).toHaveBeenCalled();

    const {getAllByTestId: getIsSelf} = render(
      <Context.Provider value={contextValue}>
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
        />
      </Context.Provider>
    );

    expect(getIsSelf('isself')).toHaveLength(1);
    const {getAllByTestId: getIsBlock} = render(
      <Context.Provider value={contextValue}>
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
        />
      </Context.Provider>
    );
    expect(getIsBlock('blocker')).toHaveLength(1);
    expect(getIsBlock('disableComment')).toHaveLength(1);
  });
});
