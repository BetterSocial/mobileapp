import * as React from 'react';
import {StyleSheet, Text, View} from 'react-native';

// import PostPageDetailComponent from '../../components/PostPageDetail'
import {useQueryClient} from '@tanstack/react-query';
import PostPageDetailComponent from '../../components/PostPageDetail';
import {withInteractionsManaged} from '../../components/WithInteractionManaged';
import {Context} from '../../context';
import {setFeedByIndex} from '../../context/actions/feeds';
import {CONTEXT_SOURCE} from '../../hooks/usePostContextHooks';
import useMainPdp from './hooks/useMainPdp';

const FeedsPostDetail = (props) => {
  const [feedsContext, dispatch] = React.useContext(Context).feeds;
  const {feedId, refreshCache, haveSeeMore, refreshParent, contextSource, data} =
    props.route.params;
  const {feeds} = feedsContext;
  const {navigateToReplyView} = useMainPdp(props);

  const queryClient = useQueryClient();

  const getAllCache = () => {
    // Get all cached queries
    const cache = queryClient.getQueryCache();
    return cache;
  };
  const cacheData = getAllCache(); // This will contain all cached queries

  return (
    <View style={styles.container}>
      <Text>With React Query</Text>
      <PostPageDetailComponent
        feeds={feeds}
        feedId={feedId}
        dispatch={dispatch}
        setFeedByIndexProps={setFeedByIndex}
        navigateToReplyView={navigateToReplyView}
        page={props.route.name}
        contextSource={contextSource || CONTEXT_SOURCE.FEEDS}
        haveSeeMore={haveSeeMore}
        parentData={data}
        refreshParent={refreshParent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%'
  }
});

export default withInteractionsManaged(FeedsPostDetail);
