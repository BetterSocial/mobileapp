import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import {useNavigation} from '@react-navigation/core';

import PostPageDetailComponent from '../../components/PostPageDetail';
import {CONTEXT_SOURCE} from '../../hooks/usePostContextHooks';
import {Context} from '../../context';
import {setFeedByIndex} from '../../context/actions/otherProfileFeed';

const OtherProfilePostDetail = (props) => {
  const [feeds, dispatch] = React.useContext(Context).otherProfileFeed;
  const {index, feedId, isKeyboardOpen} = props.route.params;
  const navigation = useNavigation();

  const navigateToReplyView = (data) => {
    navigation.navigate('OtherProfileReplyComment', data);
  };

  return (
    <View style={styles.container}>
      <PostPageDetailComponent
        index={index}
        feedId={feedId}
        feeds={feeds.feeds}
        dispatch={dispatch}
        setFeedByIndexProps={setFeedByIndex}
        navigateToReplyView={navigateToReplyView}
        contextSource={CONTEXT_SOURCE.OTHER_PROFILE_FEEDS}
        isKeyboardOpen={isKeyboardOpen}
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

export default OtherProfilePostDetail;
