import {render, cleanup} from '@testing-library/react-native';
import * as React from 'react';
import RenderList from '../../../src/screens/FeedScreen/RenderList';

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useRoute: () => jest.fn(),
  useNavigation: () => jest.fn
}));

describe('Comment Feed component should be correct', () => {
  afterEach(cleanup);

  it('write comment render should be correct', () => {
    const data = {
      actor: {},
      anon_user_info_color_code: '#BA43BA',
      anon_user_info_color_name: 'Magenta',
      anon_user_info_emoji_code: '🐟',
      anon_user_info_emoji_name: 'Fish',
      anonimity: true,
      bg: 'rgba(186,67,186,0.25)',
      count_downvote: 0,
      count_upvote: 0,
      duration_feed: '30',
      expired_at: '2024-01-19T16:22:58.709Z',
      final_score: 0.00004546798486855583,
      foreign_id: '6578d4db-e37a-4996-a4a2-f35954c53b0f',
      id: '09e80213-9f54-11ee-bf64-124f97b82f95',
      images_url: [],
      isBlurredPost: true,
      is_following_target: true,
      is_self: false,
      latest_reactions: {comments: [], downvotes: [], upvotes: []},
      latest_reactions_extra: {},
      location: 'Everywhere',
      message: 'Test fajarismv2',
      object: '',
      origin: null,
      own_reactions: {comments: [], downvotes: [], upvotes: []},
      post_performance_comments_score: 0.8575420528805874,
      post_type: 0,
      privacy: 'public',
      reaction_counts: {},
      score: 0.00004546798486855583,
      score_details: {
        BP_score: 0,
        D_bench_score: 3300,
        D_score: 6,
        WS_D_score: 0.8271987601704766,
        WS_nonBP_score: 1.0008008808488615,
        WS_updown_score: 0.9460110398142146,
        W_score: 2,
        _id: '09e80213-9f54-11ee-bf64-124f97b82f95',
        anonimity: true,
        att_score: 0.30720000000000003,
        count_weekly_posts: 0,
        created_at: '2023-12-20 16:22:58',
        domain_score: 1,
        downvote_point: 0,
        expiration_setting: '30',
        expired_at: '2024-01-19 16:22:58',
        foreign_id: '6578d4db-e37a-4996-a4a2-f35954c53b0f',
        has_done_final_process: false,
        has_link: false,
        impr_score: 25,
        longC_score: 0,
        p2_score: 0.0011556464123527875,
        p3_score: 0.8575420528805874,
        p_longC_score: 1,
        p_perf_score: 0.8575420528805874,
        post_score: 0.00004546798486855583,
        privacy: 'public',
        rec_score: 0.16514756776711936,
        s_updown_score: 0.5227272727272727,
        time: '2023-12-20T16:22:58.733314',
        topics: [],
        u_score: 0.045880200260194196,
        updated_at: '2024-01-03 15:05:25',
        upvote_point: 0
      },
      target: '',
      time: '2023-12-20T16:22:58.733314',
      to: [],
      topics: [],
      user_score: 0.045880200260194196,
      verb: 'tweet',
      version: 2
    };
    const {getByTestId} = render(<RenderList item={data} />);
    expect(getByTestId('writeComment')).toBeTruthy();
  });
});
