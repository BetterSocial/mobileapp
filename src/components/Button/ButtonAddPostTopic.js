import * as React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import PostToCommunity from '../../assets/icon/PostToCommunity';
import dimen from '../../utils/dimen';
import useBetterNavigationHook from '../../hooks/navigation/useBetterNavigationHook';
import {colors} from '../../utils/colors';
import ShadowFloatingButtons from './ShadowFloatingButtons';

const ButtonAddPostTopic = ({topicName, onRefresh}) => {
  const {toCreatePostWithTopic} = useBetterNavigationHook();

  const onAddPostPressed = () => {
    toCreatePostWithTopic(topicName, {onRefresh});
  };

  return (
    <View style={styles.container}>
      <ShadowFloatingButtons>
        <TouchableOpacity
          onPress={onAddPostPressed}
          style={styles.buttonContainer}
          testID="onaddtopicbutton">
          <View style={styles.postToCommunityContainer}>
            <PostToCommunity />
            <Text style={styles.text}>{'Post to \nCommunity'}</Text>
          </View>
        </TouchableOpacity>
      </ShadowFloatingButtons>
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
