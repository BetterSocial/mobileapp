/* eslint-disable no-use-before-define */
/* eslint-disable no-underscore-dangle */
import * as React from 'react';
import PropTypes from 'prop-types';
import {Pressable, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useNavigation} from '@react-navigation/core';

import MemoIcNewChat from '../../../assets/icons/ic_new_chat';
import MemoIcSearch from '../../../assets/icons/Ic_search';
import StringConstant from '../../../utils/string/StringConstant';
import dimen from '../../../utils/dimen';
import {DISCOVERY_TAB_USERS} from '../../../utils/constants';
import {useDynamicColors} from '../../../hooks/useToggleColors';
import {COLORS, SIZES} from '../../../utils/theme';
import {fonts} from '../../../utils/fonts';

const Search = ({route, onPress, isShowNewChat = true, isAnon}) => {
  const navigation = useNavigation();
  const dynamicColors = useDynamicColors(isAnon);

  const __handleOnSearchClicked = () => {
    navigation.push('DiscoveryScreen', {
      tab: DISCOVERY_TAB_USERS
    });
  };

  const themeColor = () => {
    if (route?.name === 'SignedChannelList') return COLORS.signed_primary;
    return COLORS.anon_primary;
  };

  return (
    <View style={styles.animatedViewContainer}>
      <Pressable onPress={__handleOnSearchClicked} style={styles.searchPressableContainer}>
        <View style={styles.wrapperSearch}>
          <View style={styles.wrapperIcon}>
            <MemoIcSearch width={16.67} height={16.67} />
          </View>
          <Text style={styles.input}>{StringConstant.chatTabHeaderPlaceholder}</Text>
        </View>
      </Pressable>
      {isShowNewChat && (
        <TouchableOpacity style={styles.wrapperButton} onPress={onPress}>
          <Text style={[styles.newPostText, {color: themeColor()}]}>
            {StringConstant.chatTabHeaderCreateChatButtonText}
          </Text>
          <View style={styles.chatIconContainer}>
            <MemoIcNewChat height={18} width={16} color={themeColor()} style={styles.newChatIcon} />
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    marginBottom: SIZES.base
  },
  searchPressableContainer: {
    flex: 1
  },
  wrapperSearch: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: COLORS.lightgrey,
    marginLeft: 20,
    marginRight: 12,
    borderRadius: 8,
    alignSelf: 'center',
    height: 36
  },
  wrapperButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginEnd: SIZES.base,
    paddingRight: 12,
    paddingTop: 9,
    paddingBottom: 9
  },
  input: {
    paddingStart: 10,
    lineHeight: 36,
    flex: 1,
    paddingBottom: 0,
    paddingTop: 0,
    fontFamily: fonts.inter[400],
    fontSize: 14,
    alignSelf: 'center',
    color: COLORS.blackgrey
  },
  wrapperIcon: {
    marginLeft: 8,
    alignSelf: 'center',
    justifyContent: 'center'
  },
  newPostText: (dynamicColors) => ({
    color: dynamicColors.primary,
    marginRight: dimen.normalizeDimen(5),
    fontFamily: 'Inter-SemiBold',
    fontSize: 12,
    lineHeight: 14.52
  }),
  newChatIcon: {
    marginTop: 0
  },
  animatedViewContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    marginBottom: SIZES.base,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    paddingTop: 7,
    paddingBottom: 7,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightgrey
  },
  chatIconContainer: {
    marginLeft: dimen.normalizeDimen(5)
  }
});

Search.propTypes = {
  route: PropTypes.object.isRequired,
  onPress: PropTypes.func.isRequired
};

export default Search;
