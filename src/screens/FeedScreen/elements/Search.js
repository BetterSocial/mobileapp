import * as React from 'react';
import {View, Text, StyleSheet, Animated, Pressable} from 'react-native';

import MemoIc_search from '../../../assets/icons/Ic_search';
import StringConstant from '../../../utils/string/StringConstant';
import {fonts} from '../../../utils/fonts';
import {COLORS, FONTS, SIZES} from '../../../utils/theme';

const Search = ({animatedValue, onContainerClicked = () => {}, getSearchLayout}) => {
  const onSearchLayout = (event) => {
    const {height} = event.nativeEvent.layout;
    if (getSearchLayout) {
      getSearchLayout(height);
    }
  };

  return (
    <Animated.View onLayout={onSearchLayout} style={styles.animatedViewContainer(animatedValue)}>
      <Pressable onPress={onContainerClicked} style={styles.searchContainer}>
        <View style={styles.wrapperSearch}>
          <View style={styles.wrapperIcon}>
            <MemoIc_search width={16.67} height={16.67} />
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
    backgroundColor: COLORS.white,
    marginBottom: SIZES.base,
    marginHorizontal: SIZES.base
  },
  searchContainer: {
    flex: 1
  },
  wrapperSearch: {
    flex: 1,
    backgroundColor: COLORS.lightgrey,
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
    color: COLORS.blackgrey,
    alignSelf: 'center'
  },
  wrapperIcon: {
    marginLeft: 8,
    alignSelf: 'center',
    justifyContent: 'center'
  },
  newPostText: {
    color: COLORS.anon_primary,
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
    borderBottomColor: COLORS.lightgrey
  })
});

export default React.memo(Search);
