import {act, renderHook} from '@testing-library/react-hooks';
import * as paramBuilder from '../../src/utils/navigation/paramBuilder';

import useFeed from '../../src/screens/FeedScreen/hooks/useFeed';
import {normalizeFontSizeByWidth} from '../../src/utils/fonts';
import dimen from '../../src/utils/dimen';
import {COLORS} from '../../src/utils/theme';

jest.mock('@react-navigation/bottom-tabs', () => ({
  useBottomTabBarHeight: jest.fn()
}));
const mockedGoBack = jest.fn();
const mockedNavigate = jest.fn();
const mockPush = jest.fn();
jest.mock('@react-navigation/core', () => ({
  useNavigation: () => ({
    goBack: mockedGoBack,
    navigate: mockedNavigate,
    push: mockPush
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
    data = {};
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
  it(' navigateToLinkContextPage should run correctly', async () => {
    const mockItem = {
      og: {
        domain: 'https://detik.com',
        domainImage: 'https://image.png'
      }
    };
    const {result} = renderHook(useFeed);
    const spyBuilder = jest.spyOn(paramBuilder, 'linkContextScreenParamBuilder');
    await result.current.navigateToLinkContextPage(mockItem);
    expect(spyBuilder).toHaveBeenCalled();
  });
  it('getHeightFooter should run correctly', async () => {
    const {result} = renderHook(useFeed);
    expect(result.current.getHeightFooter()).toEqual(normalizeFontSizeByWidth(49));
  });
  it('getHeightHeader should run correctly', async () => {
    const {result} = renderHook(useFeed);
    expect(result.current.getHeightHeader()).toEqual(dimen.size.FEED_HEADER_HEIGHT);
  });
  it('initialSetup should run correctly', async () => {
    const item = {
      reaction_counts: {
        upvotes: 0,
        downvotes: 1
      }
    };
    const {result} = renderHook(useFeed);
    await result.current.initialSetup(item);
    expect(result.current.totalVote).toEqual(-1);
  });

  it('initialSetup should run correctly', async () => {
    const {result} = renderHook(useFeed);
    await result.current.setTotalVote(1);
    expect(result.current.handleTextCountStyle()).toEqual(COLORS.anon_primary);
    await result.current.setTotalVote(-1);
    expect(result.current.handleTextCountStyle()).toEqual(COLORS.redalert);
    await result.current.setTotalVote(0);
    expect(result.current.handleTextCountStyle()).toEqual(COLORS.gray110);
  });

  it('getTotalReaction should run correctly', async () => {
    const {result} = renderHook(useFeed);
    const feedDetail = {
      reaction_counts: {
        comment: 1
      },
      latest_reactions: {
        comment: [
          {
            children_counts: {
              comment: 2
            },
            latest_children: {
              comment: [{children_counts: {comment: 2}}]
            }
          }
        ]
      }
    };
    expect(result.current.getTotalReaction(feedDetail)).toEqual(5);
    expect(result.current.getTotalReaction(null)).toEqual(0);
  });
});
