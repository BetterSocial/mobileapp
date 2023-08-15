import * as React from 'react';
import {StyleSheet, View} from 'react-native';

import PostPageDetailComponent from '../../components/PostPageDetail';
import {CONTEXT_SOURCE} from '../../hooks/usePostContextHooks';
import {Context} from '../../context';
import {setFeedByIndex} from '../../context/actions/myProfileFeed';
import useMainPdp from '../PostPageDetail/hooks/useMainPdp';

const ProfilePostDetail = (props) => {
  const [feedsContext, dispatch] = React.useContext(Context).myProfileFeed;
  const {feedId, refreshParent} = props.route.params;
  const {feeds} = feedsContext;

  const {navigateToReplyView} = useMainPdp(props);
  React.useEffect(
    () => () => {
      if (refreshParent) {
        refreshParent();
      }
    },
    []
  );

  return (
    <View style={styles.container}>
      <PostPageDetailComponent
        feedId={feedId}
        feeds={feeds}
        dispatch={dispatch}
        setFeedByIndexProps={setFeedByIndex}
        navigateToReplyView={navigateToReplyView}
        contextSource={CONTEXT_SOURCE.PROFILE_FEEDS}
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

export default ProfilePostDetail;
