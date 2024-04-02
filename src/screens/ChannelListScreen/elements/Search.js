/* eslint-disable no-underscore-dangle */
import * as React from 'react';
import {Animated, Pressable, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useNavigation} from '@react-navigation/core';

import MemoIcNewChat from '../../../assets/icons/ic_new_chat';
import MemoIc_search from '../../../assets/icons/Ic_search';
import StringConstant from '../../../utils/string/StringConstant';
import {COLORS, SIZES} from '../../../utils/theme';
import {DISCOVERY_TAB_USERS} from '../../../utils/constants';
import {fonts, normalizeFontSize} from '../../../utils/fonts';
import {useDynamicColors} from '../../../hooks/useToggleColors';
import dimen from '../../../utils/dimen';

const Search = ({onPress, animatedValue, isAnon, isShowNewChat = true}) => {
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
            <MemoIc_search width={17} height={17} fill={COLORS.white2} />
          </View>
          <Text
            // placeholder={StringConstant.chatTabHeaderPlaceholder}
            // placeholderTextColor={COLORS.lightgrey}
            style={styles.input}>
            {StringConstant.chatTabHeaderPlaceholder}
          </Text>
        </View>
      </Pressable>
      {isShowNewChat && (
        <TouchableOpacity style={styles.wrapperButton} onPress={onPress}>
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
        </TouchableOpacity>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    marginBottom: SIZES.base
  },
  searchPressableContainer: {
    flex: 1,
    justifyContent: 'center'
  },
  wrapperSearch: {
    flexDirection: 'row',
    backgroundColor: COLORS.gray100,
    marginLeft: 20,
    marginRight: 12,
    borderRadius: 12,
    alignSelf: 'center',
    height: 28
  },
  wrapperButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginEnd: SIZES.base,
    paddingLeft: 8,
    paddingRight: 12,
    paddingTop: 9,
    paddingBottom: 9
  },
  input: {
    paddingStart: 10,
    lineHeight: 28,
    flex: 1,
    paddingBottom: 0,
    paddingTop: 0,
    fontFamily: fonts.inter[400],
    fontSize: 14,
    alignSelf: 'center',
    color: COLORS.gray300
  },
  wrapperIcon: {
    marginLeft: 8,
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
    backgroundColor: COLORS.white,
    marginBottom: SIZES.base,
    marginTop: animatedValue,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    height: '100%',
    paddingTop: 7,
    paddingBottom: 7
  })
});

export default Search;
