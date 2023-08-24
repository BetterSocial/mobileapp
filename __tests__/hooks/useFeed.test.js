import {act, renderHook} from '@testing-library/react-hooks';

import useFeed from '../../src/screens/FeedScreen/hooks/useFeed';

jest.mock('@react-navigation/bottom-tabs', () => ({
  useBottomTabBarHeight: jest.fn()
}));
const mockedGoBack = jest.fn();
const mockedNavigate = jest.fn();
jest.mock('@react-navigation/core', () => ({
  useNavigation: () => ({
    goBack: mockedGoBack,
    navigate: mockedNavigate
  }),
  useRoute: () => ({
    params: {
      isBottomTab: false
    }
  })
}));

jest.mock('react', () => {
  const originReact = jest.requireActual('react');
  return {
    ...originReact,
    useContext: () => ({
      profile: [
        {
          id: 'c6c91b04-795c-404e-b012-ea28813a2006'
        }
      ]
    })
  };
});

describe('Logic feed should run correctly', () => {
  const itemUpvote = {
    own_reactions: {
      upvotes: [{user_id: 'c6c91b04-795c-404e-b012-ea28813a2006'}]
    }
  };
  const itemDownvote = {
    own_reactions: {
      downvotes: [{user_id: 'c6c91b04-795c-404e-b012-ea28813a2006'}]
    }
  };
  const itemNoVote = {
    own_reactions: {}
  };
  const selfId = 'c6c91b04-795c-404e-b012-ea28813a2006';
  it('checkvotes should run correctly', () => {
    const {result} = renderHook(useFeed);
    act(() => {
      result.current.checkVotes(itemUpvote, selfId);
    });
    expect(result.current.voteStatus).toEqual('upvote');
    expect(result.current.statusUpvote).toBeTruthy();
    act(() => {
      result.current.checkVotes(itemDownvote, selfId);
    });
    expect(result.current.voteStatus).toEqual('downvote');
    expect(result.current.statusDownvote).toBeTruthy();
    act(() => {
      result.current.checkVotes(itemNoVote, selfId);
    });
    expect(result.current.voteStatus).toEqual('none');
  });

  it('handlevote should run correctly', () => {
    let data = {
      upvotes: 0,
      downvotes: 1
    };
    const {result} = renderHook(useFeed);
    act(() => {
      result.current.handleVote(data);
    });
    expect(result.current.totalVote).toEqual(-1);
    data = {
      upvotes: 1,
      downvotes: 1
    };
    act(() => {
      result.current.handleVote(data);
    });
    expect(result.current.totalVote).toEqual(0);
  });

  it('onPressDownVoteHook should run correctly', () => {
    const {result} = renderHook(useFeed);
    act(() => {
      result.current.setVoteStatus('upvote');
    });
    act(() => {
      result.current.onPressDownVoteHook();
    });
    expect(result.current.voteStatus).toEqual('downvote');
    expect(result.current.totalVote).toEqual(-2);
    act(() => {
      result.current.setVoteStatus('downvote');
    });
    act(() => {
      result.current.onPressDownVoteHook();
    });
    expect(result.current.voteStatus).toEqual('none');
    expect(result.current.totalVote).toEqual(-1);
    act(() => {
      result.current.setVoteStatus('none');
    });
    act(() => {
      result.current.onPressDownVoteHook();
    });
    expect(result.current.voteStatus).toEqual('downvote');
    expect(result.current.totalVote).toEqual(-2);
  });
  it('onPressUpVoteHook should run correctly', () => {
    const {result} = renderHook(useFeed);
    act(() => {
      result.current.setVoteStatus('upvote');
    });
    act(() => {
      result.current.onPressUpvoteHook();
    });
    expect(result.current.voteStatus).toEqual('none');
    expect(result.current.totalVote).toEqual(-1);
    act(() => {
      result.current.setVoteStatus('downvote');
    });
    act(() => {
      result.current.onPressUpvoteHook();
    });
    expect(result.current.voteStatus).toEqual('upvote');
    expect(result.current.totalVote).toEqual(1);
    act(() => {
      result.current.setVoteStatus('none');
    });
    act(() => {
      result.current.onPressUpvoteHook();
    });
    expect(result.current.voteStatus).toEqual('upvote');
    expect(result.current.totalVote).toEqual(2);
  });
});
