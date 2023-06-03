import * as React from 'react';
import {Shadow} from 'react-native-shadow-2';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import PostToCommunity from '../../assets/icon/PostToCommunity';
import dimen from '../../utils/dimen';
import useBetterNavigationHook from '../../hooks/navigation/useBetterNavigationHook';
import {colors} from '../../utils/colors';

const ButtonAddPostTopic = ({topicName, onRefresh}) => {
  const {toCreatePostWithTopic} = useBetterNavigationHook();

  const onAddPostPressed = () => {
    toCreatePostWithTopic(topicName, {onRefresh});
  };

  return (
    <View style={styles.container}>
      <Shadow distance={4} startColor="#00000033" endColor="#00000000" offset={[0, 2]}>
        <TouchableOpacity
          onPress={onAddPostPressed}
          style={styles.buttonContainer}
          testID="onaddtopicbutton">
          <View style={styles.postToCommunityContainer}>
            <PostToCommunity />
            <Text style={styles.text}>{'Post in \nCommunity'}</Text>
          </View>
        </TouchableOpacity>
      </Shadow>
    </View>
  );
};

export default ButtonAddPostTopic;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: dimen.size.TOPIC_FEED_BUTTON_HEIGHT_FROM_BOTTOM,
    right: dimen.size.FEED_ACTION_BUTTON_HEIGHT_FROM_RIGHT,
    zIndex: 1,
    backgroundColor: '#0000'
  },
  buttonContainer: {
    backgroundColor: colors.holytosca,
    // height: dimen.size.TOPIC_FEED_POST_BUTTON_HEIGHT,
    borderRadius: dimen.size.FEED_ACTION_BUTTON_RADIUS,
    justifyContent: 'center'
  },
  postToCommunityContainer: {
    flexDirection: 'row',
    paddingLeft: dimen.normalizeDimen(10),
    paddingRight: dimen.normalizeDimen(10),
    justifyContent: 'center',
    alignItems: 'center'
  },
  text: {
    fontFamily: 'Inter',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 12,
    lineHeight: 14,
    marginTop: dimen.normalizeDimen(8),
    marginBottom: dimen.normalizeDimen(7),
    marginLeft: dimen.normalizeDimen(7),
    color: colors.white,
    alignSelf: 'center'
  }
});
