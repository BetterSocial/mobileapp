import * as React from 'react';
import {View, Text, StyleSheet, Animated, Pressable} from 'react-native';

import MemoIc_search from '../../../assets/icons/Ic_search';
import StringConstant from '../../../utils/string/StringConstant';
import {fonts} from '../../../utils/fonts';
import {COLORS, FONTS, SIZES} from '../../../utils/theme';

const Search = ({
  animatedValue,
  onContainerClicked = () => {},
  getSearchLayout,
  children,
  containerStyle
}) => {
  const onSearchLayout = (event) => {
    const {height} = event.nativeEvent.layout;
    if (getSearchLayout) {
      getSearchLayout(height);
    }
  };

  if (children) {
    return (
      <Animated.View
        onLayout={onSearchLayout}
        style={[HeaderStyles.animatedViewContainer(animatedValue), containerStyle]}>
        <View style={[HeaderStyles.wrapperSearch, {backgroundColor: 'white'}]}>{children}</View>
      </Animated.View>
    );
  }

  return (
    <Animated.View
      onLayout={onSearchLayout}
      style={[HeaderStyles.animatedViewContainer(animatedValue), containerStyle]}>
      <Pressable onPress={onContainerClicked} style={HeaderStyles.searchContainer}>
        <View style={HeaderStyles.wrapperSearch}>
          <View style={HeaderStyles.wrapperIcon}>
            <MemoIc_search width={16.67} height={16.67} />
          </View>
          <Text style={HeaderStyles.inputText}>{StringConstant.newsTabHeaderPlaceholder}</Text>
        </View>
      </Pressable>
    </Animated.View>
  );
};

export const HeaderStyles = StyleSheet.create({
  searchContainer: {
    flex: 1
  },
  wrapperSearch: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    marginLeft: 20,
    marginRight: 20,
    borderRadius: 8,
    alignSelf: 'center',
    flexDirection: 'row',
    height: 36
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
  },
  input: {
    marginRight: 16,
    paddingStart: 10,
    flex: 1,
    fontSize: 14,
    fontFamily: fonts.inter[400],
    height: 36,
    paddingTop: 0,
    paddingBottom: 0
  },
  inputText: {
    marginRight: 16,
    paddingStart: 10,
    flex: 1,
    fontSize: 14,
    fontFamily: fonts.inter[400],
    // height: 36,
    paddingTop: 0,
    paddingBottom: 0,
    color: COLORS.gray1,
    alignSelf: 'center'
  },
  wrapperIcon: {
    marginLeft: 8,
    alignSelf: 'center',
    justifyContent: 'center'
  },
  newPostText: {
    color: COLORS.holytosca,
    marginRight: 11,
    ...FONTS.h3
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
    borderBottomColor: COLORS.alto
  })
});

export default React.memo(Search);
