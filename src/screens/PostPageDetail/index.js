import * as React from 'react';
import {StyleSheet, View} from 'react-native';

// import PostPageDetailComponent from '../../components/PostPageDetail'
import PostPageDetailComponent from '../../components/PostPageDetail';
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
  React.useEffect(() => {
    if (refreshCache && typeof refreshCache === 'function') {
      refreshCache();
    }
    return () => {
      if (refreshParent && typeof refreshParent === 'function') {
        refreshParent();
      }
    };
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

export default FeedsPostDetail;
