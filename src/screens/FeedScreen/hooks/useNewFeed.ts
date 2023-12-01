import {useInfiniteQuery, useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {listFeedColor} from '../../../configs/FeedColor';
import {getFeedDetail, getMainFeedV2WithTargetFeed} from '../../../service/post';
import {upVote} from '../../../service/vote';
import {hexToRgb} from '../../../utils/colors';

const getRandomInt = (min, max) => {
  const byteArray = new Uint8Array(1);
  crypto.getRandomValues(byteArray);

  const range = max - min + 1;
  const max_range = 256;
  if (byteArray[0] >= Math.floor(max_range / range) * range) {
    return getRandomInt(min, max);
  }
  return min + (byteArray[0] % range);
};

const handleBgContentFeed = (feed) => {
  if (feed.anon_user_info_color_code) {
    const rgb = hexToRgb(feed?.anon_user_info_color_code, 0.25);
    return {
      bg: `${rgb}`,
      color: 'rgba(0,0,0)'
    };
  }
  const randomIndex = getRandomInt(0, listFeedColor.length);
  const newColor = {
    ...listFeedColor[randomIndex],
    bg: hexToRgb(listFeedColor[randomIndex].bg, 0.25),
    color: 'rgba(0,0,0)'
  };
  return newColor;
};

const mappingColorFeed = (dataFeed) => {
  return dataFeed.map((feed) => {
    return {...feed, ...handleBgContentFeed(feed)};
  });
};

const handleDataFeeds = (dataFeeds) => {
  if (Array.isArray(dataFeeds.data) && dataFeeds.data.length > 0) {
    return mappingColorFeed(dataFeeds.data);
  }
  return [];
};

const fetchFeeds = async ({pageParam = 0, targetFeed}) => {
  const query = `?offset=${pageParam}`;
  const dataFeeds = await getMainFeedV2WithTargetFeed(query, targetFeed);

  if (!dataFeeds || !Array.isArray(dataFeeds.data) || dataFeeds.data.length === 0) {
    return [];
  }

  return handleDataFeeds(dataFeeds);
};

export const useFeedInfiniteQuery = (targetFeed) => {
  return useInfiniteQuery({
    queryKey: ['feeds'],
    queryFn: ({pageParam = 0}) => fetchFeeds({pageParam, targetFeed}),
    getNextPageParam: (lastPage, allPages) => {
      const {nextOffset} = allPages[allPages.length - 1];
      return nextOffset !== undefined ? nextOffset : false;
    },
    initialPageParam: 0
  });
};

export const useGetPostById = (postId) => {
  return useQuery({
    queryKey: ['post'],
    queryFn: () => getFeedDetail(postId).then((res) => res.data),
    networkMode: 'offlineFirst'
  });
};

export const useUpvoteMutation = (targetFeed) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({post}) => {
      await upVote(post); // Replace with your actual upvote function
    },

    onMutate: async ({post}) => {
      await queryClient.cancelQueries(['feeds', targetFeed]);
      await queryClient.cancelQueries(['post', post.activity_id]);

      const previousFeeds = queryClient.getQueryData(['feeds', targetFeed]);
      let previousPost = queryClient.getQueryData(['post', post.activity_id]);

      if (!previousPost) {
        const foundInFeeds = previousFeeds?.pages
          .flat()
          .find((item) => item.activity_id === post.activity_id);
        if (foundInFeeds) {
          previousPost = foundInFeeds;
        }
      }

      // Optimistic update logic for feeds
      if (previousFeeds) {
        queryClient.setQueryData(['feeds', targetFeed], (oldData) => {
          const newData = oldData.pages
            .flat()
            .map((item) =>
              item.activity_id === post.activity_id
                ? {...item, voteStatus: post.status ? 'upvote' : 'none'}
                : item
            );
          return {...oldData, pages: newData};
        });
      }

      // Optimistic update for the single post, if it exists
      if (previousPost) {
        const updatedPost = {
          ...previousPost,
          voteStatus: post.status ? 'upvote' : 'none'
        };

        queryClient.setQueryData(['post', post.activity_id], updatedPost);
      }

      return {previousFeeds, previousPost};
    },

    onError: (err, {post}, context) => {
      if (context.previousFeeds) {
        queryClient.setQueryData(['feeds', targetFeed], context.previousFeeds);
      }
      if (context.previousPost) {
        queryClient.setQueryData(['post', post.activity_id], context.previousPost);
      }
    },

    onSettled: ({post}) => {
      queryClient.invalidateQueries(['feeds', targetFeed]);
      queryClient.invalidateQueries(['post', post.activity_id]);
    }
  });
};
