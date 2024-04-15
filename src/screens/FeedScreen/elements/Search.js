import * as React from 'react';
import {View, Text, StyleSheet, Animated, Pressable} from 'react-native';

import MemoIc_search from '../../../assets/icons/Ic_search';
import StringConstant from '../../../utils/string/StringConstant';
import {fonts, normalizeFontSize} from '../../../utils/fonts';
import {COLORS, FONTS, SIZES} from '../../../utils/theme';
import dimen from '../../../utils/dimen';

const Search = ({animatedValue, onContainerClicked = () => {}, getSearchLayout}) => {
  const onSearchLayout = (event) => {
    const {height} = event.nativeEvent.layout;
    if (getSearchLayout) {
      getSearchLayout(height);
    }
  };

  return (
    <Animated.View onLayout={onSearchLayout} style={styles.animatedViewContainer(animatedValue)}>
      <Pressable onPress={onContainerClicked} style={styles.searchPressableContainer}>
        <View style={styles.wrapperSearch}>
          <View style={styles.wrapperIcon}>
            <MemoIc_search width={16.67} height={16.67} fill={COLORS.gray310} />
          </View>
          <Text style={styles.inputText}>{StringConstant.discoverySearchBarPlaceholder}</Text>
        </View>
      </Pressable>
    </Animated.View>
  );
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
  newPostText: {
    color: COLORS.anon_primary,
    marginRight: dimen.normalizeDimen(4),
    fontFamily: fonts.inter[600],
    fontSize: normalizeFontSize(14)
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

export default React.memo(Search);
