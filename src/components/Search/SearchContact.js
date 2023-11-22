import * as React from 'react';
import {Animated, Platform, StyleSheet, TextInput, View} from 'react-native';

import MemoIc_search from '../../assets/icons/Ic_search';
import {COLORS, FONTS, SIZES} from '../../utils/theme';

const Search = ({animatedValue, text, setText}) => {
  return (
    <Animated.View style={styles.animatedViewContainer(animatedValue)}>
      <View style={styles.wrapperSearch}>
        <TextInput
          placeholder={'Search Users'}
          style={styles.input}
          text={text}
          onChangeText={setText}
          returnKeyType="search"
          blurOnSubmit={true}
        />
        <View style={styles.wrapperIcon}>
          <MemoIc_search width={20} height={20} />
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  wrapperSearch: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    marginHorizontal: 12,
    borderRadius: SIZES.radius,
    alignSelf: 'center',
    justifyContent: 'center',
    paddingVertical: Platform.OS === 'ios' ? 7 : 0
    // alignItems: 'center'
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
    marginLeft: 20,
    paddingStart: 16
    // lineHeight: 24,
  },
  wrapperIcon: {
    position: 'absolute',
    left: 8,
    top: 0,
    bottom: 0,
    justifyContent: 'center'
  },
  newPostText: {
    color: COLORS.holytosca,
    marginRight: 11,
    ...FONTS.h4
  },
  animatedViewContainer: (animatedValue) => ({
    flexDirection: 'row',
    backgroundColor: 'white',
    // marginBottom: SIZES.base,
    marginTop: animatedValue,
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    padding: 7,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray1
  })
});

export default Search;
