import * as React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Animated,
} from 'react-native';

import MemoIcNewChat from '../../../assets/icons/ic_new_chat';
import MemoIc_search from '../../../assets/icons/Ic_search';
import StringConstant from '../../../utils/string/StringConstant';
import {COLORS, FONTS, SIZES} from '../../../utils/theme';

const Search = ({onPress, animatedValue}) => {
  return (
    <Animated.View style={styles.animatedViewContainer(animatedValue)}>
      <View style={styles.wrapperSearch}>
        <TextInput
          multiline={false}
          placeholder={'Search Users'}
          style={styles.input}
        />
        <View style={styles.wrapperIcon}>
          <MemoIc_search width={20} height={20} />
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'white',
    marginBottom: SIZES.base,
  },
  wrapperSearch: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    marginLeft: 15,
    marginRight: 15,
    borderRadius: SIZES.radius,
    alignSelf: 'center',
  },
  wrapperButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginEnd: SIZES.base,
    paddingLeft: 8,
    paddingRight: 8,
    paddingTop: 9,
    paddingBottom: 9,
    // backgroundColor: 'red',
  },
  input: {
    marginLeft: 24,
    paddingStart: 16,
    lineHeight: 24,
  },
  wrapperIcon: {
    position: 'absolute',
    left: 8,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },
  newPostText: {
    color: COLORS.holyTosca,
    marginRight: 11,
    ...FONTS.h4,
  },
  animatedViewContainer: (animatedValue) => ({
    flexDirection: 'row',
    backgroundColor: 'white',
    marginBottom: SIZES.base,
    marginTop: animatedValue,
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    padding: 7,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray1,
  }),
});

export default Search;
