/* eslint-disable no-underscore-dangle */
import * as React from 'react';
import {Animated, Pressable, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useNavigation} from '@react-navigation/core';

import MemoIcNewChat from '../../../assets/icons/ic_new_chat';
import IconSearch from '../../../assets/icons/Ic_search';
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
      <View style={styles.row}>
        <Pressable onPress={__handleOnSearchClicked} style={styles.searchPressableContainer}>
          <View style={styles.wrapperSearch}>
            <View style={styles.wrapperIcon}>
              <IconSearch width={16.67} height={16.67} fill={COLORS.gray310} />
            </View>
            <Text style={styles.inputText}>{StringConstant.chatTabHeaderPlaceholder}</Text>
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
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flex: 1,
    paddingHorizontal: dimen.normalizeDimen(20)
  },
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
    marginRight: dimen.normalizeDimen(8),
    borderRadius: SIZES.base,
    alignSelf: 'center',
    height: 34
  },
  wrapperButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 34,
    width: 98
  },
  inputText: {
    marginRight: dimen.normalizeDimen(16),
    paddingStart: dimen.normalizeDimen(10),
    flex: 1,
    fontSize: normalizeFontSize(14),
    fontFamily: fonts.inter[400],
    paddingTop: 0,
    paddingBottom: 0,
    color: COLORS.gray410,
    alignSelf: 'center'
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
    paddingTop: dimen.normalizeDimen(7),
    paddingBottom: dimen.normalizeDimen(7)
  })
});

export default Search;
