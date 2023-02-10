import * as React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import PostToCommunity from '../../assets/icon/PostToCommunity';
import dimen from '../../utils/dimen';
import useBetterNavigationHook from '../../hooks/navigation/useBetterNavigationHook';
import {colors} from '../../utils/colors';

const ButtonAddPostTopic = ({topicName}) => {
  const {toCreatePostWithTopic} = useBetterNavigationHook();

  const onAddPostPressed = () => {
    toCreatePostWithTopic(topicName);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={onAddPostPressed}
        style={styles.buttonContainer}
        testID="onaddtopicbutton">
        <View style={styles.postToCommunityContainer}>
          <PostToCommunity />
          <Text style={styles.text}>{'Post in \nCommunity'}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default ButtonAddPostTopic;

const styles = StyleSheet.create({
  container: {
    width: '100%'
  },
  buttonContainer: {
    backgroundColor: colors.holytosca,
    // height: dimen.size.TOPIC_FEED_POST_BUTTON_HEIGHT,
    borderRadius: dimen.size.FEED_ACTION_BUTTON_RADIUS,
    justifyContent: 'center',
    position: 'absolute',
    bottom: dimen.size.FEED_ACTION_BUTTON_HEIGHT_FROM_BOTTOM,
    right: dimen.size.FEED_ACTION_BUTTON_HEIGHT_FROM_RIGHT,
    zIndex: 1,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.8,
    shadowRadius: 1
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
