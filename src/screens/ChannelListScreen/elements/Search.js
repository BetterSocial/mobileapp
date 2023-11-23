/* eslint-disable no-underscore-dangle */
import * as React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Animated, Pressable} from 'react-native';
import {useNavigation} from '@react-navigation/core';

import MemoIcNewChat from '../../../assets/icons/ic_new_chat';
import MemoIc_search from '../../../assets/icons/Ic_search';
import {fonts} from '../../../utils/fonts';
import StringConstant from '../../../utils/string/StringConstant';
import {COLORS, SIZES} from '../../../utils/theme';
import {DISCOVERY_TAB_USERS} from '../../../utils/constants';

const Search = ({onPress, animatedValue}) => {
  const navigation = useNavigation();

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
            <MemoIc_search width={16.67} height={16.67} />
          </View>
          <Text
            // placeholder={StringConstant.chatTabHeaderPlaceholder}
            // placeholderTextColor={COLORS.gray1}
            style={styles.input}>
            {StringConstant.chatTabHeaderPlaceholder}
          </Text>
        </View>
      </Pressable>
      <TouchableOpacity style={styles.wrapperButton} onPress={onPress}>
        <Text style={styles.newPostText}>{StringConstant.chatTabHeaderCreateChatButtonText}</Text>
        <View>
          <MemoIcNewChat height={17} width={15} style={styles.newChatIcon} />
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'white',
    marginBottom: SIZES.base
  },
  searchPressableContainer: {
    flex: 1
  },
  wrapperSearch: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
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
    paddingLeft: 8,
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
    color: COLORS.gray1
  },
  wrapperIcon: {
    marginLeft: 8,
    alignSelf: 'center',
    justifyContent: 'center'
  },
  newPostText: {
    color: COLORS.holytosca,
    marginRight: 11,
    fontFamily: 'Inter-SemiBold',
    fontSize: 12,
    lineHeight: 14.52
  },
  newChatIcon: {
    marginTop: 0
  },
  animatedViewContainer: (animatedValue) => ({
    flexDirection: 'row',
    backgroundColor: 'white',
    marginBottom: SIZES.base,
    marginTop: animatedValue,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    paddingTop: 7,
    paddingBottom: 7,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray1
  })
});

export default Search;
