/* eslint-disable no-underscore-dangle */
import * as React from 'react';
import PropTypes from 'prop-types';
import {Animated, Pressable, StyleSheet, Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/core';

import MemoIcNewChat from '../../../assets/icons/ic_new_chat';
import MemoIcSearch from '../../../assets/icons/Ic_search';
import PressEventTrackingWrapper from '../../../components/Wrapper/PressEventTrackingWrapper';
import StringConstant from '../../../utils/string/StringConstant';
import dimen from '../../../utils/dimen';
import {BetterSocialEventTracking} from '../../../libraries/analytics/analyticsEventTracking';
import {COLORS, SIZES} from '../../../utils/theme';
import {DISCOVERY_TAB_USERS} from '../../../utils/constants';
import {fonts, normalizeFontSize} from '../../../utils/fonts';
import {useDynamicColors} from '../../../hooks/useToggleColors';

const Search = ({
  onPress,
  animatedValue,
  isAnon,
  eventPressName = BetterSocialEventTracking.UNDEFINED_EVENT,
  isShowNewChat = true
}) => {
  const navigation = useNavigation();
  const dynamicColors = useDynamicColors(isAnon);

  const __handleOnSearchClicked = () => {
    navigation.push('DiscoveryScreen', {
      tab: DISCOVERY_TAB_USERS
    });
  };

  return (
    <Animated.View style={styles.animatedViewContainer(animatedValue)}>
      <Pressable onPress={__handleOnSearchClicked} style={styles.searchPressableContainer}>
        <View style={styles.wrapperSearch}>
          <View style={styles.wrapperIcon}>
            <MemoIcSearch width={17} height={17} fill={COLORS.gray310} />
          </View>
          <Text style={styles.input}>{StringConstant.chatTabHeaderPlaceholder}</Text>
        </View>
      </Pressable>
      {isShowNewChat && (
        <PressEventTrackingWrapper
          name={eventPressName}
          style={styles.wrapperButton}
          onPress={onPress}>
          <Text style={styles.newPostText(dynamicColors)}>
            {StringConstant.chatTabHeaderCreateChatButtonText}
          </Text>
          <View>
            <MemoIcNewChat
              height={18}
              width={16}
              style={styles.newChatIcon}
              color={dynamicColors.primary}
            />
          </View>
        </PressEventTrackingWrapper>
      )}
    </Animated.View>
  );
};

Search.propTypes = {
  route: PropTypes.string,
  onPress: PropTypes.func,
  animatedValue: PropTypes.number,
  isAnon: PropTypes.bool,
  eventPressName: PropTypes.string,
  isShowNewChat: PropTypes.bool
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: COLORS.almostBlack,
    marginBottom: SIZES.base
  },
  searchPressableContainer: {
    flex: 1,
    justifyContent: 'center'
  },
  wrapperSearch: {
    flexDirection: 'row',
    backgroundColor: COLORS.gray110,
    marginLeft: dimen.normalizeDimen(20),
    marginRight: dimen.normalizeDimen(12),
    borderRadius: SIZES.base,
    alignSelf: 'center',
    height: 34
  },
  wrapperButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginEnd: SIZES.base,
    paddingLeft: dimen.normalizeDimen(8),
    paddingRight: dimen.normalizeDimen(12),
    paddingTop: dimen.normalizeDimen(9),
    paddingBottom: dimen.normalizeDimen(9)
  },
  input: {
    paddingStart: dimen.normalizeDimen(10),
    lineHeight: normalizeFontSize(28),
    flex: 1,
    paddingBottom: 0,
    paddingTop: 0,
    fontFamily: fonts.inter[400],
    fontSize: normalizeFontSize(14),
    alignSelf: 'center',
    color: COLORS.gray410
  },
  wrapperIcon: {
    marginLeft: dimen.normalizeDimen(8),
    alignSelf: 'center',
    justifyContent: 'center'
  },
  newPostText: (dynamicColors) => ({
    color: dynamicColors.primary,
    marginRight: dimen.normalizeDimen(4),
    fontFamily: fonts.inter[600],
    fontSize: normalizeFontSize(14)
  }),
  newChatIcon: {
    marginTop: 0
  },
  animatedViewContainer: (animatedValue) => ({
    flexDirection: 'row',
    backgroundColor: COLORS.almostBlack,
    marginBottom: SIZES.base,
    marginTop: animatedValue,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    height: '100%',
    paddingTop: dimen.normalizeDimen(7),
    paddingBottom: dimen.normalizeDimen(7)
  })
});

export default Search;
