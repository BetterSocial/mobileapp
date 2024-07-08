import * as React from 'react';
import {
  ActivityIndicator,
  Animated,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  View
} from 'react-native';

import IconClose from '../../../assets/icon/IconClose';
import MemoIc_search from '../../../assets/icons/Ic_search';
import {COLORS, FONTS, SIZES} from '../../../utils/theme';

const Search = ({
  onPress,
  animatedValue,
  onChangeText,
  text,
  onClearText,
  isLoading = false,
  style,
  onPressIn = () => {}
}) => (
  <Animated.View style={[styles.animatedViewContainer(animatedValue), style]}>
    <View style={styles.wrapperSearch}>
      <TextInput
        value={text}
        placeholder={'Search Users'}
        placeholderTextColor={COLORS.gray410}
        style={styles.input}
        onChangeText={(t) => {
          onChangeText(t);
        }}
        returnKeyType="search"
        onSubmitEditing={onPress}
        textAlignVertical="center"
        blurOnSubmit={true}
        keyboardAppearance="dark"
        onPressIn={onPressIn}
      />
      <View style={styles.wrapperIcon}>
        <MemoIc_search width={20} height={20} fill={COLORS.gray310} />
      </View>
      <View style={styles.wrapperSecondaryIcon}>
        {isLoading && <ActivityIndicator style={styles.loader} color={COLORS.gray410} />}
        {!isLoading && (
          <Pressable onPress={onClearText}>
            <IconClose width={8} height={8} color={COLORS.gray410} />
          </Pressable>
        )}
      </View>
    </View>
  </Animated.View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: COLORS.almostBlack
  },
  wrapperSearch: {
    flex: 1,
    backgroundColor: COLORS.gray110,
    marginLeft: 15,
    marginRight: 15,
    borderRadius: SIZES.radius,
    paddingTop: Platform.OS === 'ios' ? 10 : 0,
    paddingBottom: Platform.OS === 'ios' ? 10 : 0,
    justifyContent: 'center'
  },
  loader: {
    width: 20,
    height: 20
  },
  wrapperButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginEnd: SIZES.base,
    paddingLeft: 8,
    paddingRight: 8,
    paddingTop: 9,
    paddingBottom: 9
    // backgroundColor: COLORS.redalert,
  },
  input: {
    marginLeft: 28,
    marginRight: 28,
    paddingEnd: 16,
    paddingStart: 16,
    // lineHeight: 24,
    fontFamily: 'Inter',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 14,
    color: COLORS.black
    // backgroundColor: COLORS.redalert
  },
  wrapperIcon: {
    position: 'absolute',
    left: 8,
    top: 0,
    bottom: 0,
    justifyContent: 'center'
  },
  wrapperSecondaryIcon: {
    position: 'absolute',
    right: 12,
    top: 0,
    bottom: 0,
    justifyContent: 'center'
  },
  newPostText: {
    color: COLORS.anon_primary,
    marginRight: 11,
    ...FONTS.h4
  },
  animatedViewContainer: (animatedValue) => ({
    flexDirection: 'row',
    backgroundColor: COLORS.almostBlack,
    marginTop: animatedValue,
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    padding: 7,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.gray110,
    borderTopWidth: 0.5,
    borderTopColor: COLORS.gray110
  })
});

export default Search;
