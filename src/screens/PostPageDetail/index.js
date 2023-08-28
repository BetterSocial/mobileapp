import * as React from 'react';
import {StyleSheet, View} from 'react-native';

// import PostPageDetailComponent from '../../components/PostPageDetail'
import PostPageDetailComponent from '../../components/PostPageDetail';
import useMainPdp from './hooks/useMainPdp';
import {CONTEXT_SOURCE} from '../../hooks/usePostContextHooks';
import {Context} from '../../context';
import {setFeedByIndex} from '../../context/actions/feeds';
import {withInteractionsManaged} from '../../components/WithInteractionManaged';

const FeedsPostDetail = (props) => {
  const [feedsContext, dispatch] = React.useContext(Context).feeds;
  const {feedId, refreshCache, haveSeeMore} = props.route.params;
  const {feeds} = feedsContext;
  const {navigateToReplyView} = useMainPdp(props);
  React.useEffect(() => {
    if (refreshCache && typeof refreshCache === 'function') {
      refreshCache();
    }
  }, []);
  return (
    <View style={styles.container}>
      <PostPageDetailComponent
        feeds={feeds}
        feedId={feedId}
        dispatch={dispatch}
        setFeedByIndexProps={setFeedByIndex}
        navigateToReplyView={navigateToReplyView}
        page={props.route.name}
        contextSource={CONTEXT_SOURCE.FEEDS}
        haveSeeMore={haveSeeMore}
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
