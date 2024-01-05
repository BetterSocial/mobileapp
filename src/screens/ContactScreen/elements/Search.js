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

import IcClearCircle from '../../../assets/icons/ic_clear_circle';
import MemoIc_search from '../../../assets/icons/Ic_search';
import {COLORS, FONTS, SIZES} from '../../../utils/theme';

const Search = ({onPress, animatedValue, onChangeText, text, onClearText, isLoading = false}) => (
  <Animated.View style={styles.animatedViewContainer(animatedValue)}>
    <View style={styles.wrapperSearch}>
      <TextInput
        value={text}
        placeholder={'Search Users'}
        style={styles.input}
        onChangeText={(t) => {
          onChangeText(t);
        }}
        returnKeyType="search"
        onSubmitEditing={onPress}
        textAlignVertical="center"
        clearButtonMode="while-editing"
        blurOnSubmit={true}
      />
      <View style={styles.wrapperIcon}>
        <MemoIc_search width={20} height={20} />
      </View>
      <View style={styles.wrapperSecondaryIcon}>
        {isLoading && <ActivityIndicator style={styles.loader} color={COLORS.blackgrey} />}
        {!isLoading && (
          <Pressable onPress={onClearText}>
            <IcClearCircle width={20} height={20} />
          </Pressable>
        )}
      </View>
    </View>
  </Animated.View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: COLORS.white
  },
  wrapperSearch: {
    flex: 1,
    backgroundColor: COLORS.lightgrey,
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
    right: 8,
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
    backgroundColor: COLORS.white,
    marginTop: animatedValue,
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    padding: 7,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.lightgrey,
    borderTopWidth: 0.5,
    borderTopColor: COLORS.lightgrey
  })
});

export default Search;
