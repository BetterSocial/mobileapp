import * as React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import PropTypes from 'prop-types';
import PostToCommunity from '../../assets/icon/PostToCommunity';
import useBetterNavigationHook from '../../hooks/navigation/useBetterNavigationHook';
import dimen from '../../utils/dimen';
import {fonts, normalizeFontSize} from '../../utils/fonts';
import ShadowFloatingButtons from './ShadowFloatingButtons';
import {COLORS} from '../../utils/theme';

const ButtonAddPostTopic = ({topicName, onRefresh, followType}) => {
  const {toCreatePostWithTopic} = useBetterNavigationHook();

  const onAddPostPressed = () => {
    toCreatePostWithTopic(topicName, {onRefresh, followType});
  };

  return (
    <View style={styles.container}>
      <ShadowFloatingButtons>
        <TouchableOpacity
          onPress={onAddPostPressed}
          style={styles.buttonContainer(followType)}
          testID="onaddtopicbutton">
          <View style={styles.postToCommunityContainer}>
            <PostToCommunity
              color={followType === 'incognito' ? COLORS.anon_secondary : COLORS.signed_primary}
            />
            <Text style={styles.text}>{'Post to \nCommunity'}</Text>
          </View>
        </TouchableOpacity>
      </ShadowFloatingButtons>
    </View>
  );
};

ButtonAddPostTopic.propTypes = {
  topicName: PropTypes.string,
  onRefresh: PropTypes.func,
  followType: PropTypes.string
};

export default ButtonAddPostTopic;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: dimen.normalizeDimen(30),
    right: 0,
    zIndex: 99,
    backgroundColor: COLORS.black
  },
  buttonContainer: (followType) => ({
    backgroundColor: followType === 'incognito' ? COLORS.anon_secondary : COLORS.signed_primary,
    borderRadius: dimen.size.FEED_ACTION_BUTTON_RADIUS,
    justifyContent: 'center'
  }),
  postToCommunityContainer: {
    flexDirection: 'row',
    paddingLeft: dimen.normalizeDimen(10),
    paddingRight: dimen.normalizeDimen(10),
    justifyContent: 'center',
    alignItems: 'center'
  },
  text: {
    fontFamily: fonts.inter[400],
    fontSize: normalizeFontSize(12),
    lineHeight: normalizeFontSize(14),
    marginTop: dimen.normalizeDimen(8),
    marginBottom: dimen.normalizeDimen(7),
    marginLeft: dimen.normalizeDimen(7),
    color: COLORS.white,
    alignSelf: 'center'
  }
});
